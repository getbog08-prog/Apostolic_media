/* =========================================================
   Apostolic Media
   Supabase Connection
   File: js/supabase.js
   ========================================================= */

(function (window) {
  "use strict";

  const config =
    window.ApostolicConfig || window.APP_CONFIG || {};

  const supabaseConfig = config.SUPABASE || {
    URL: "",
    ANON_KEY: ""
  };

  let client = null;

  // =======================================================
  // Check whether Supabase is configured
  // =======================================================

  function isConfigured() {
    return Boolean(
      supabaseConfig.URL &&
      supabaseConfig.ANON_KEY
    );
  }

  // =======================================================
  // Initialize Supabase
  // =======================================================

  function init() {
    if (client) {
      return client;
    }

    if (!isConfigured()) {
      console.warn(
        "Supabase is not configured yet. Add URL and ANON_KEY in js/config.js."
      );

      return null;
    }

    if (
      !window.supabase ||
      typeof window.supabase.createClient !== "function"
    ) {
      console.error(
        "Supabase library was not loaded."
      );

      return null;
    }

    try {
      client = window.supabase.createClient(
        supabaseConfig.URL,
        supabaseConfig.ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        }
      );

      window.dispatchEvent(
        new CustomEvent("supabaseReady", {
          detail: {
            client: client
          }
        })
      );

      console.log("Supabase initialized successfully.");

      return client;

    } catch (error) {
      console.error(
        "Failed to initialize Supabase:",
        error
      );

      return null;
    }
  }

  // =======================================================
  // Get client
  // =======================================================

  function getClient() {
    if (!client) {
      init();
    }

    return client;
  }

  // =======================================================
  // Authentication
  // =======================================================

  async function getSession() {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: { session: null },
        error: null
      };
    }

    return await supabase.auth.getSession();
  }

  async function getUser() {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: { user: null },
        error: null
      };
    }

    return await supabase.auth.getUser();
  }

  async function signOut() {
    const supabase = getClient();

    if (!supabase) {
      return {
        error: null
      };
    }

    return await supabase.auth.signOut();
  }

  // =======================================================
  // Database helpers
  // =======================================================

  function from(table) {
    const supabase = getClient();

    if (!supabase) {
      throw new Error(
        "Supabase is not configured."
      );
    }

    return supabase.from(table);
  }

  async function select(
    table,
    columns = "*",
    options = {}
  ) {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: [],
        error: null
      };
    }

    let query = supabase
      .from(table)
      .select(columns);

    if (options.eq) {
      Object.keys(options.eq).forEach((key) => {
        query = query.eq(
          key,
          options.eq[key]
        );
      });
    }

    if (options.in) {
      Object.keys(options.in).forEach((key) => {
        const values = Array.isArray(options.in[key]) ? options.in[key] : [];
        if (values.length) query = query.in(key, values);
      });
    }

    if (options.in) { Object.keys(options.in).forEach((key) => { const values = Array.isArray(options.in[key]) ? options.in[key] : []; if (values.length) query = query.in(key, values); }); }

    if (options.order) {
      query = query.order(
        options.order.column,
        {
          ascending:
            options.order.ascending !== false
        }
      );
    }

    if (options.in) {
      Object.keys(options.in).forEach((key) => {
        const values = Array.isArray(options.in[key]) ? options.in[key] : [];
        if (values.length) query = query.in(key, values);
      });
    }

    if (
      Number.isInteger(options.limit) &&
      options.limit > 0
    ) {
      query = query.limit(options.limit);
    }

    return await query;
  }

  async function insert(table, values) {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: null,
        error: null
      };
    }

    return await supabase
      .from(table)
      .insert(values)
      .select();
  }

  async function update(
    table,
    values,
    filters = {}
  ) {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: null,
        error: null
      };
    }

    let query = supabase
      .from(table)
      .update(values);

    Object.keys(filters).forEach((key) => {
      query = query.eq(
        key,
        filters[key]
      );
    });

    return await query.select();
  }

  async function remove(
    table,
    filters = {}
  ) {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: null,
        error: null
      };
    }

    let query = supabase
      .from(table)
      .delete();

    Object.keys(filters).forEach((key) => {
      query = query.eq(
        key,
        filters[key]
      );
    });

    return await query;
  }

  // =======================================================
  // Storage helpers
  // =======================================================

  function storage() {
    const supabase = getClient();

    if (!supabase) {
      return null;
    }

    return supabase.storage;
  }

  function bucket(name) {
    const storageClient = storage();

    if (!storageClient) {
      return null;
    }

    return storageClient.from(name);
  }

  async function removeFile(
    bucketName,
    paths = []
  ) {
    const bucketClient = bucket(bucketName);
    if (!bucketClient) {
      return {
        data: null,
        error: new Error("Supabase Storage is not configured.")
      };
    }
    return await bucketClient.remove(paths);
  }

  async function uploadFile(
    bucketName,
    path,
    file,
    options = {}
  ) {
    const bucketClient =
      bucket(bucketName);

    if (!bucketClient) {
      return {
        data: null,
        error: new Error(
          "Supabase Storage is not configured."
        )
      };
    }

    const fileOptions = {
      upsert:
        options.upsert === true
    };

    if (options.contentType) {
      fileOptions.contentType =
        options.contentType;
    }

    return await bucketClient.upload(
      path,
      file,
      fileOptions
    );
  }

  function getPublicUrl(
    bucketName,
    path
  ) {
    const bucketClient =
      bucket(bucketName);

    if (!bucketClient) {
      return null;
    }

    const result =
      bucketClient.getPublicUrl(path);

    return result.data
      ? result.data.publicUrl
      : null;
  }

  // =======================================================
  // Realtime
  // =======================================================

  function channel(name) {
    const supabase = getClient();

    if (!supabase) {
      return null;
    }

    return supabase.channel(name);
  }

  function removeChannel(channelInstance) {
    const supabase = getClient();

    if (
      !supabase ||
      !channelInstance
    ) {
      return;
    }

    return supabase.removeChannel(
      channelInstance
    );
  }

  // =======================================================
  // Auth state listener
  // =======================================================

  function onAuthStateChange(callback) {
    const supabase = getClient();

    if (!supabase) {
      return {
        data: {
          subscription: null
        }
      };
    }

    return supabase.auth.onAuthStateChange(
      callback
    );
  }

  // =======================================================
  // Public API
  // =======================================================

  const SupabaseAPI = {
    init,
    getClient,
    isConfigured,

    // Authentication
    getSession,
    getUser,
    signOut,
    onAuthStateChange,

    // Database
    from,
    select,
    insert,
    update,
    remove,

    // Storage
    storage,
    bucket,
    uploadFile,
    removeFile,
    getPublicUrl,

    // Realtime
    channel,
    removeChannel
  };

  // =======================================================
  // Global objects
  // =======================================================

  window.ApostolicSupabase =
    SupabaseAPI;

  window.SupabaseAPI =
    SupabaseAPI;

  // This is required by js/auth.js
  window.supabaseClient = null;

  // =======================================================
  // Initialize after page loads
  // =======================================================

  function initialize() {
    const result = init();

    window.supabaseClient =
      result || null;
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize
    );
  } else {
    initialize();
  }

})(window);
