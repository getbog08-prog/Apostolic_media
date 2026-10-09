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
      .select(
        columns,
        options.count ? { count: options.count } : undefined
      );

    if (options.eq) {
      Object.keys(options.eq).forEach((key) => {
        query = query.eq(key, options.eq[key]);
      });
    }

    if (options.in) {
      Object.keys(options.in).forEach((key) => {
        const values = Array.isArray(options.in[key]) ? options.in[key] : [];
        if (values.length) query = query.in(key, values);
      });
    }

    if (options.neq) {
      Object.keys(options.neq).forEach((key) => {
        query = query.neq(key, options.neq[key]);
      });
    }



    if (options.order) {
      query = query.order(
        options.order.column,
        {
          ascending:
            options.order.ascending !== false
        }
      );
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

  async function uploadFileResumable(bucketName, path, file, options = {}, onProgress) {
    const supabase = getClient();
    if (!supabase) throw new Error("Supabase is not configured.");
    const sessionResult = await supabase.auth.getSession();
    const token = sessionResult?.data?.session?.access_token;
    if (!token) throw new Error("Please sign in again before uploading.");

    const projectUrl = String(supabaseConfig.URL || "").replace(/\/$/, "");
    const directUrl = projectUrl.replace(".supabase.co", ".storage.supabase.co");
    const endpoint = directUrl + "/storage/v1/upload/resumable";
    const chunkSize = 6 * 1024 * 1024;
    const metadata = [
      "bucketName " + btoa(unescape(encodeURIComponent(bucketName))),
      "objectName " + btoa(unescape(encodeURIComponent(path))),
      "contentType " + btoa(unescape(encodeURIComponent(options.contentType || file.type || "application/octet-stream"))),
      "cacheControl " + btoa(unescape(encodeURIComponent(options.cacheControl || "3600")))
    ].join(",");

    const createUpload = () => new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Tus-Resumable", "1.0.0");
      xhr.setRequestHeader("Upload-Length", String(file.size));
      xhr.setRequestHeader("Upload-Metadata", metadata);
      xhr.setRequestHeader("x-upsert", options.upsert ? "true" : "false");
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.getResponseHeader("Location"));
        else reject(new Error(xhr.responseText || "Could not start resumable upload."));
      };
      xhr.onerror = () => reject(new Error("Network error while starting upload."));
      xhr.send();
    });

    const location = await createUpload();
    if (!location) throw new Error("Upload session was not created.");

    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, Math.min(offset + chunkSize, file.size));
      let attempts = 0;
      while (true) {
        try {
          const nextOffset = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PATCH", location, true);
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Tus-Resumable", "1.0.0");
            xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
            xhr.setRequestHeader("Upload-Offset", String(offset));
            xhr.upload.onprogress = event => {
              if (event.lengthComputable && typeof onProgress === "function") {
                onProgress(offset + event.loaded, file.size);
              }
            };
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                const serverOffset = Number(xhr.getResponseHeader("Upload-Offset"));
                resolve(Number.isFinite(serverOffset) ? serverOffset : offset + chunk.size);
              } else reject(new Error(xhr.responseText || "Chunk upload failed."));
            };
            xhr.onerror = () => reject(new Error("Network error while uploading chunk."));
            xhr.send(chunk);
          });
          offset = nextOffset;
          if (typeof onProgress === "function") onProgress(offset, file.size);
          break;
        } catch (error) {
          attempts++;
          if (attempts >= 3) throw error;
          await new Promise(resolve => setTimeout(resolve, attempts * 1500));
        }
      }
    }
    return { data: { path }, error: null };
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
    uploadFileResumable,
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
