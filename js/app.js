/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Main Application Controller
   ========================================================= */

(function () {
  "use strict";

  const APP = {
    name: "የኢየሱስ ልጆች Apostolic Media",
    version: "1.3.0",
    defaultTheme: "system",
    defaultLanguage: "en"
  };

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* =========================================================
     STORAGE
     ========================================================= */

  const storage = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {}
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {}
    }
  };

  /* =========================================================
     THEME
     ========================================================= */

  const theme = {
    get() {
      return storage.get(
        "apostolic_theme",
        APP.defaultTheme
      );
    },

    set(value) {
      const allowed = ["light", "dark", "system"];

      if (!allowed.includes(value)) {
        value = APP.defaultTheme;
      }

      document.documentElement.setAttribute(
        "data-theme",
        value
      );

      storage.set("apostolic_theme", value);

      window.dispatchEvent(
        new CustomEvent("apostolic:themechange", {
          detail: { theme: value }
        })
      );
    },

    init() {
      this.set(this.get());
    },

    toggle() {
      const current = this.get();

      if (current === "light") {
        this.set("dark");
      } else if (current === "dark") {
        this.set("system");
      } else {
        this.set("light");
      }
    }
  };

  /* =========================================================
     LANGUAGE
     ========================================================= */

  const language = {
    get() {
      return storage.get(
        "apostolic_language",
        APP.defaultLanguage
      );
    },

    set(value) {
      const allowed = ["am", "en", "om"];

      if (!allowed.includes(value)) {
        value = APP.defaultLanguage;
      }

      storage.set("apostolic_language", value);

      document.documentElement.setAttribute(
        "lang",
        value
      );

      window.dispatchEvent(
        new CustomEvent("apostolic:languagechange", {
          detail: { language: value }
        })
      );
    },

    init() {
      this.set(this.get());
    }
  };

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function initMobileMenu() {
    const menuButton =
      $(".menu-btn") ||
      $("[data-menu-toggle]") ||
      $(".mobile-menu-button") ||
      $('[data-action="toggle-sidebar"]');

    const sidebar =
      $(".sidebar") ||
      $("[data-sidebar]");

    if (!menuButton || !sidebar) return;

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      menuButton.classList.toggle("active");

      const isOpen =
        sidebar.classList.contains("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    $$(".sidebar a").forEach(function (item) {
      item.addEventListener("click", function () {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove("open");
          menuButton.classList.remove("active");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });
    });
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function initNavigation() {
    /*
      Navigation is handled by router.js.
      Keeping this function prevents duplicate navigation
      listeners from being created.
    */
  }

  function navigate(route) {
    if (!route) return;

    const cleanRoute =
      String(route)
        .replace(/^#/, "")
        .trim();

    if (window.ApostolicRouter) {
      window.ApostolicRouter.navigate(
        "#" + cleanRoute
      );
    } else {
      window.location.hash = cleanRoute;
    }
  }

  function activateNavigation(route) {
    const cleanRoute =
      String(route || "")
        .replace(/^#/, "")
        .trim();

    $$(
      "[data-route], [data-nav], [data-page], .nav-item"
    ).forEach(function (item) {
      const target =
        item.dataset.route ||
        item.dataset.nav ||
        item.dataset.page ||
        item.getAttribute("href");

      const cleanTarget =
        String(target || "")
          .replace(/^#/, "")
          .trim();

      item.classList.toggle(
        "active",
        cleanTarget === cleanRoute
      );
    });
  }

  /* =========================================================
     SEARCH
     ========================================================= */

  function initSearch() {
    const inputs = $$(
      'input[type="search"], .search-input, [data-search]'
    );

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        const query =
          input.value.trim();

        window.dispatchEvent(
          new CustomEvent("apostolic:search", {
            detail: { query }
          })
        );
      });

      input.addEventListener(
        "keydown",
        function (event) {
          if (event.key !== "Enter") return;

          const query =
            input.value.trim();

          if (!query) return;

          window.dispatchEvent(
            new CustomEvent(
              "apostolic:searchsubmit",
              {
                detail: { query }
              }
            )
          );
        }
      );
    });
  }

  /* =========================================================
     THEME CONTROLS
     ========================================================= */

  function initThemeControls() {
    $$("[data-theme], [data-set-theme]")
      .forEach(function (button) {
        if (button.dataset.themeBound) return;

        button.dataset.themeBound = "true";

        button.addEventListener(
          "click",
          function () {
            const selected =
              button.dataset.theme ||
              button.dataset.setTheme;

            if (selected) {
              theme.set(selected);
            }
          }
        );
      });

    $$(".theme-toggle, [data-theme-toggle]")
      .forEach(function (button) {
        if (button.dataset.themeToggleBound) return;

        button.dataset.themeToggleBound = "true";

        button.addEventListener(
          "click",
          function () {
            theme.toggle();
          }
        );
      });
  }

  /* =========================================================
     LANGUAGE CONTROLS
     ========================================================= */

  function initLanguageControls() {
    $$("[data-language], [data-set-language]")
      .forEach(function (button) {
        if (button.dataset.languageBound) return;

        button.dataset.languageBound = "true";

        button.addEventListener(
          "click",
          function () {
            const selected =
              button.dataset.language ||
              button.dataset.setLanguage;

            if (selected) {
              language.set(selected);
            }
          }
        );
      });
  }

  /* =========================================================
     TOAST
     ========================================================= */

  function toast(
    message,
    type = "info"
  ) {
    let container =
      $("#toastRoot") ||
      $(".toast-container");

    if (!container) {
      container =
        document.createElement("div");

      container.id =
        "toastRoot";

      container.className =
        "toast-root";

      container.setAttribute(
        "aria-live",
        "polite"
      );

      container.setAttribute(
        "aria-atomic",
        "true"
      );

      document.body.appendChild(
        container
      );
    }

    const item =
      document.createElement("div");

    item.className =
      `toast toast-${type}`;

    item.setAttribute(
      "role",
      "status"
    );

    item.textContent = message;

    container.appendChild(item);

    requestAnimationFrame(function () {
      item.classList.add("show");
    });

    setTimeout(function () {
      item.classList.remove("show");

      setTimeout(function () {
        item.remove();
      }, 250);
    }, 3000);
  }

  /* =========================================================
     HTML ESCAPE
     ========================================================= */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     MODALS
     ========================================================= */

  function closeDynamicModal(modal) {
    if (!modal) return;

    modal.remove();

    if (!$(".apostolic-modal")) {
      document.body.classList.remove(
        "modal-open"
      );
    }
  }

  function createModal(
    title,
    bodyHTML
  ) {
    const modal =
      document.createElement("div");

    modal.className =
      "modal open apostolic-modal";

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    modal.innerHTML = `
      <div class="modal-content">

        <div class="modal-header">
          <h2>${escapeHTML(title)}</h2>

          <button
            type="button"
            class="modal-close"
            data-modal-action="close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          ${bodyHTML}
        </div>

      </div>
    `;

    document.body.appendChild(
      modal
    );

    document.body.classList.add(
      "modal-open"
    );

    return modal;
  }

  function showCreateForm(
    title,
    type
  ) {
    return createModal(
      title,
      `
        <form
          class="dynamic-form"
          data-create-form="${escapeHTML(type)}"
        >

          <div class="form-group">
            <label for="createTitle">
              Title
            </label>

            <input
              id="createTitle"
              name="title"
              type="text"
              placeholder="Enter title"
              required
            />
          </div>

          <div class="form-group">
            <label for="createDescription">
              Description
            </label>

            <textarea
              id="createDescription"
              name="description"
              rows="5"
              placeholder="Write a description..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="createLanguage">
              Language
            </label>

            <select
              id="createLanguage"
              name="language"
            >
              <option value="en">
                English
              </option>

              <option value="am">
                አማርኛ
              </option>

              <option value="om">
                Afaan Oromoo
              </option>
            </select>
          </div>

          <button
            type="submit"
            class="btn primary"
          >
            Create
          </button>

        </form>
      `
    );
  }

  function showUploadForm(
    title,
    type
  ) {
    const modal = createModal(
      title,
      `
        <form
          class="dynamic-form"
          data-upload-form="${escapeHTML(type)}"
        >

          <div class="form-group">
            <label for="uploadTitle">
              Title
            </label>

            <input
              id="uploadTitle"
              name="title"
              type="text"
              placeholder="Enter title"
              required
            />
          </div>

          <div class="form-group">
            <label for="uploadFile">
              Select file
            </label>

            <input
              id="uploadFile"
              name="file"
              type="file"
              required
            />
          </div>

          <div class="form-group">
            <label for="uploadDescription">
              Description
            </label>

            <textarea
              id="uploadDescription"
              name="description"
              rows="4"
              placeholder="Write a description..."
            ></textarea>
          </div>

          <div
            class="upload-status"
            hidden
            role="status"
            aria-live="polite"
          ></div>

          <button
            type="button"
            class="btn primary"
            data-upload-submit
          >
            Upload
          </button>

        </form>
      `
    );

    const uploadButton = modal.querySelector(
      "[data-upload-submit]"
    );

    const uploadForm = modal.querySelector(
      "[data-upload-form]"
    );

    if (uploadButton && uploadForm) {
      uploadButton.addEventListener("click", function (event) {
        event.preventDefault();
        handleUploadSubmit(uploadForm);
      });
    }

    return modal;
  }

  /* =========================================================
     PAGE ACTIONS
     ========================================================= */

  function initPageActionDelegation() {
    document.addEventListener(
      "click",
      function (event) {
        const actionElement =
          event.target.closest(
            "[data-page-action]"
          );

        if (actionElement) {
          event.preventDefault();

          handlePageAction(
            actionElement.dataset.pageAction
          );

          return;
        }

        const modalClose =
          event.target.closest(
            "[data-modal-action='close']"
          );

        if (modalClose) {
          event.preventDefault();

          closeDynamicModal(
            modalClose.closest(
              ".apostolic-modal"
            )
          );

          return;
        }

        const modal =
          event.target.closest(
            ".apostolic-modal"
          );

        if (
          modal &&
          event.target === modal
        ) {
          closeDynamicModal(modal);
        }
      }
    );

    document.addEventListener(
      "submit",
      function (event) {
        const uploadForm =
          event.target.closest(
            "[data-upload-form]"
          );

        if (uploadForm) {
          event.preventDefault();

          handleUploadSubmit(
            uploadForm
          );

          return;
        }

        const createForm =
          event.target.closest(
            "[data-create-form]"
          );

        if (createForm) {
          event.preventDefault();

          handleCreateSubmit(
            createForm
          );
        }
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Escape") return;

        const modal =
          $(".apostolic-modal");

        if (modal) {
          closeDynamicModal(modal);
        }
      }
    );
  }

  function handlePageAction(
    action
  ) {
    switch (action) {

      case "create-teaching":
        showCreateForm(
          "Create Teaching",
          "teaching"
        );
        break;

      case "create-sermon":
        showCreateForm(
          "Create Sermon",
          "sermon"
        );
        break;

      case "create-song":
        showCreateForm(
          "Create Song",
          "song"
        );
        break;

      case "create-lyric":
        showCreateForm(
          "Create Lyrics",
          "lyric"
        );
        break;

      case "create-course":
        showCreateForm(
          "Create Course",
          "course"
        );
        break;

      case "create-event":
        showCreateForm(
          "Create Event",
          "event"
        );
        break;

      case "create-playlist":
        showCreateForm(
          "Create Playlist",
          "playlist"
        );
        break;

      case "upload-teaching":
        showUploadForm(
          "Upload Teaching",
          "teaching"
        );
        break;

      case "upload-sermon":
        showUploadForm(
          "Upload Sermon",
          "sermon"
        );
        break;

      case "upload-song":
        showUploadForm(
          "Upload Song",
          "song"
        );
        break;

      case "upload-video":
        showUploadForm(
          "Upload Video",
          "video"
        );
        break;

      case "upload-bible":
        showUploadForm(
          "Upload Bible Resource",
          "bible"
        );
        break;

      case "upload-course":
        showUploadForm(
          "Upload Course Material",
          "course"
        );
        break;

      case "upload-document":
        showUploadForm(
          "Upload Document",
          "document"
        );
        break;

      default:
        toast(
          "This feature is not available yet.",
          "info"
        );
    }
  }

  /* =========================================================
     UPLOAD
     ========================================================= */

  async function handleUploadSubmit(
    form
  ) {
    const formData =
      new FormData(form);

    const title =
      String(
        formData.get("title") || ""
      ).trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    const file =
      formData.get("file");

    const type =
      form.dataset.uploadForm ||
      "document";

    const statusElement =
      form.querySelector(".upload-status");

    function setUploadStatus(
      message,
      status = "info"
    ) {
      if (!statusElement) return;

      statusElement.textContent =
        message || "";

      statusElement.dataset.status =
        status;

      statusElement.hidden =
        !message;
    }

    if (!title) {
      setUploadStatus(
        "Please enter a title.",
        "error"
      );
      toast(
        "Please enter a title.",
        "error"
      );
      return;
    }

    if (
      !file ||
      !file.name
    ) {
      setUploadStatus(
        "Please select a file.",
        "error"
      );
      toast(
        "Please select a file.",
        "error"
      );
      return;
    }

    const submitButton =
      form.querySelector(
        "[data-upload-submit]"
      );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent =
        "Uploading...";
    }

    setUploadStatus(
      "Preparing upload...",
      "info"
    );

    try {
      const api =
        window.ApostolicSupabase;

      const config =
        window.ApostolicConfig ||
        window.APP_CONFIG || {};

      const bucketName =
        (config.UPLOADS &&
          config.UPLOADS.BUCKET) ||
        "Apostolic_Media";

      if (!api || !api.isConfigured()) {
        throw new Error(
          "Supabase is not configured. Please check js/config.js."
        );
      }

      const safeName =
        file.name
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          )
          .replace(
            /_+/g,
            "_"
          );

      const path =
        `${type}/${Date.now()}-${safeName}`;

      setUploadStatus(
        "Uploading file to Supabase Storage...",
        "info"
      );

      const uploadPromise =
        api.uploadFile(
          bucketName,
          path,
          file,
          {
            upsert: false
          }
        );

      const uploadResult =
        await Promise.race([
          uploadPromise,
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Upload timed out after 60 seconds. Please check your internet connection and Supabase Storage policy."
                  )
                ),
              60000
            )
          )
        ]);

      if (
        !uploadResult ||
        uploadResult.error
      ) {
        throw (
          uploadResult &&
          uploadResult.error
        ) || new Error(
          "Supabase Storage upload failed."
        );
      }

      setUploadStatus(
        "File uploaded. Saving file information...",
        "info"
      );

      const fileUrl =
        api.getPublicUrl(
          bucketName,
          path
        );

      if (!fileUrl) {
        throw new Error(
          "The file uploaded, but its public URL could not be created."
        );
      }

      const dbResult =
        await api.insert(
          "media_uploads",
          {
            title,
            description,
            type,
            file_name: file.name,
            file_path: path,
            file_url: fileUrl,
            file_size: file.size,
            file_type:
              file.type || null
          }
        );

      if (
        !dbResult ||
        dbResult.error
      ) {
        throw (
          dbResult &&
          dbResult.error
        ) || new Error(
          "The file uploaded, but its database record could not be saved."
        );
      }

      setUploadStatus(
        "Upload completed successfully.",
        "success"
      );

      closeDynamicModal(
        form.closest(
          ".apostolic-modal"
        )
      );

      toast(
        `"${title}" uploaded successfully to Apostolic Media.`,
        "success"
      );

    } catch (error) {
      console.error(
        "Supabase upload failed:",
        error
      );

      const message =
        error && error.message
          ? error.message
          : "Unknown upload error.";

      setUploadStatus(
        `Upload failed: ${message}`,
        "error"
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          "Upload";
      }

      toast(
        `Upload failed: ${message}`,
        "error"
      );
    }
  }

  /* =========================================================
     CREATE
     ========================================================= */

  function handleCreateSubmit(
    form
  ) {
    const formData =
      new FormData(form);

    const title =
      String(
        formData.get("title") || ""
      ).trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    const selectedLanguage =
      String(
        formData.get("language") || "en"
      );

    const type =
      form.dataset.createForm ||
      "content";

    if (!title) {
      toast(
        "Please enter a title.",
        "error"
      );
      return;
    }

    const items =
      storage.get(
        "apostolic_created_items",
        []
      );

    items.push({
      id: Date.now().toString(),
      title,
      description,
      language: selectedLanguage,
      type,
      createdAt:
        new Date().toISOString()
    });

    storage.set(
      "apostolic_created_items",
      items
    );

    closeDynamicModal(
      form.closest(
        ".apostolic-modal"
      )
    );

    toast(
      `"${title}" created successfully.`,
      "success"
    );
  }
     /* =========================================================
     BACK TO TOP
     ========================================================= */

  function initBackToTop() {
    const button =
      $("[data-action='back-to-top']") ||
      $(".back-to-top");

    if (!button) return;

    window.addEventListener(
      "scroll",
      function () {
        button.classList.toggle(
          "show",
          window.scrollY > 400
        );
      }
    );

    button.addEventListener(
      "click",
      function () {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  /* =========================================================
     CONNECTION STATUS
     ========================================================= */

  function initConnectionStatus() {
    function update() {
      document.body.classList.toggle(
        "offline",
        !navigator.onLine
      );

      document.body.classList.toggle(
        "online",
        navigator.onLine
      );
    }

    window.addEventListener(
      "online",
      update
    );

    window.addEventListener(
      "offline",
      update
    );

    update();
  }

  /* =========================================================
     KEYBOARD SHORTCUTS
     ========================================================= */

  function initKeyboardShortcuts() {
    document.addEventListener(
      "keydown",
      function (event) {

        const isSearchShortcut =
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() === "k";

        if (isSearchShortcut) {
          event.preventDefault();

          const search =
            $("#globalSearch") ||
            $('input[type="search"]');

          if (search) {
            search.focus();
          }

          return;
        }

        if (
          event.key === "/" &&
          !["INPUT", "TEXTAREA", "SELECT"]
            .includes(
              document.activeElement.tagName
            )
        ) {
          event.preventDefault();

          const search =
            $("#globalSearch") ||
            $('input[type="search"]');

          if (search) {
            search.focus();
          }
        }
      }
    );
  }

  /* =========================================================
     VISIBILITY
     ========================================================= */

  function initVisibility() {
    document.addEventListener(
      "visibilitychange",
      function () {
        window.dispatchEvent(
          new CustomEvent(
            "apostolic:visibility",
            {
              detail: {
                visible:
                  !document.hidden
              }
            }
          )
        );
      }
    );
  }

  /* =========================================================
     ERROR HANDLING
     ========================================================= */

  function initErrorHandling() {
    window.addEventListener(
      "error",
      function (event) {
        console.error(
          "Apostolic Media error:",
          event.error ||
            event.message
        );
      }
    );

    window.addEventListener(
      "unhandledrejection",
      function (event) {
        console.error(
          "Apostolic Media promise error:",
          event.reason
        );
      }
    );
  }

  /* =========================================================
     SERVICE WORKER
     ========================================================= */

  function initServiceWorker() {
    if (
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    window.addEventListener(
      "load",
      function () {
        navigator.serviceWorker
          .register("./sw.js")
          .catch(function (error) {
            console.warn(
              "Service worker registration failed:",
              error
            );
          });
      }
    );
  }

  /* =========================================================
     PAGE HELPERS
     ========================================================= */

  function renderPageHero(
    title,
    subtitle,
    actions = ""
  ) {
    return `
      <section class="page-hero">

        <div>
          <h1>
            ${escapeHTML(title)}
          </h1>

          <p>
            ${escapeHTML(subtitle)}
          </p>
        </div>

        ${
          actions
            ? `<div class="page-actions">
                 ${actions}
               </div>`
            : ""
        }

      </section>
    `;
  }

  function renderCard(
    icon,
    title,
    description,
    action = ""
  ) {
    return `
      <article class="card">

        <div class="card-icon">
          ${icon}
        </div>

        <h3>
          ${escapeHTML(title)}
        </h3>

        <p>
          ${escapeHTML(description)}
        </p>

        ${
          action
            ? `<div class="card-actions">
                 ${action}
               </div>`
            : ""
        }

      </article>
    `;
  }

  function renderAction(
    label,
    action
  ) {
    return `
      <button
        type="button"
        class="btn primary"
        data-page-action="${escapeHTML(action)}"
      >
        ${escapeHTML(label)}
      </button>
    `;
  }

  /* =========================================================
     PAGES
     ========================================================= */

  const pages = {

    /* -------------------------------------------------------
       HOME
       ------------------------------------------------------- */

    home: {
      title: "Home",

      content: `
        ${renderPageHero(
          "Welcome to Apostolic Media",
          "A place for Bible study, Christian teachings, worship, sermons and community."
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Bible",
            "Read and explore the Word of God.",
            `<a class="btn" href="#bible">Open Bible</a>`
          )}

          ${renderCard(
            "🎓",
            "Teachings",
            "Christian teachings and Bible studies.",
            `<a class="btn" href="#teachings">Explore Teachings</a>`
          )}

          ${renderCard(
            "🎙️",
            "Sermons",
            "Listen to Christian sermons and messages.",
            `<a class="btn" href="#sermons">View Sermons</a>`
          )}

          ${renderCard(
            "🎵",
            "Songs",
            "Discover worship songs and Christian music.",
            `<a class="btn" href="#songs">Browse Songs</a>`
          )}

          ${renderCard(
            "🎬",
            "Videos",
            "Watch Christian videos and media.",
            `<a class="btn" href="#videos">Watch Videos</a>`
          )}

          ${renderCard(
            "👥",
            "Community",
            "Connect with the Apostolic Christian community.",
            `<a class="btn" href="#community">Join Community</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       BIBLE
       ------------------------------------------------------- */

    bible: {
      title: "Bible",

      content: `
        ${renderPageHero(
          "Bible",
          "Explore the Holy Scriptures."
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Read Bible",
            "Read Scripture and continue your Bible journey."
          )}

          ${renderCard(
            "🔎",
            "Bible Search",
            "Search for books, chapters and verses."
          )}

          ${renderCard(
            "⭐",
            "Saved Verses",
            "Keep verses that are meaningful to you.",
            `<a class="btn" href="#saved">Saved</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       BIBLE STUDY
       ------------------------------------------------------- */

    "bible-study": {
      title: "Bible Study",

      content: `
        ${renderPageHero(
          "Bible Study",
          "Grow deeper in the Word through structured study."
        )}

        <section class="content-grid">

          ${renderCard(
            "📚",
            "Christian Written Teachings",
            "Read original Christian articles, teachings, Bible studies, and other written materials."
          )}

          ${renderCard(
            "📝",
            "Study Notes",
            "Create and organize your personal Bible study notes."
          )}

          ${renderCard(
            "🎓",
            "Courses",
            "Explore structured Christian learning.",
            `<a class="btn" href="#courses">View Courses</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       TEACHINGS
       ------------------------------------------------------- */

    teachings: {
      title: "Teachings",

      content: `
        ${renderPageHero(
          "Teachings",
          "Christian teachings, Bible lessons and written resources.",
          renderAction(
            "Create Teaching",
            "create-teaching"
          ) +
          renderAction(
            "Upload Teaching",
            "upload-teaching"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Bible Teaching",
            "Learn biblical principles and Christian doctrine."
          )}

          ${renderCard(
            "✍️",
            "Written Teachings",
            "Read Christian articles and study materials."
          )}

          ${renderCard(
            "🎓",
            "Learning",
            "Continue your Christian learning journey."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SERMONS
       ------------------------------------------------------- */

    sermons: {
      title: "Sermons",

      content: `
        ${renderPageHero(
          "Sermons",
          "Listen to Christian sermons and messages.",
          renderAction(
            "Upload Sermon",
            "upload-sermon"
          ) +
          renderAction(
            "Create Sermon",
            "create-sermon"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎙️",
            "Recent Sermons",
            "Listen to recent Christian messages."
          )}

          ${renderCard(
            "🔥",
            "Featured Messages",
            "Messages selected for encouragement and spiritual growth."
          )}

          ${renderCard(
            "📚",
            "Sermon Library",
            "Browse the sermon collection."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SONGS
       ------------------------------------------------------- */

    songs: {
      title: "Songs",

      content: `
        ${renderPageHero(
          "Songs",
          "Christian worship songs and music.",
          renderAction(
            "Upload Song",
            "upload-song"
          ) +
          renderAction(
            "Create Song",
            "create-song"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎵",
            "Worship Songs",
            "Discover Christian worship music."
          )}

          ${renderCard(
            "🎤",
            "Artists",
            "Explore Christian artists.",
            `<a class="btn" href="#artists">Artists</a>`
          )}

          ${renderCard(
            "📜",
            "Lyrics",
            "Read lyrics for Christian songs.",
            `<a class="btn" href="#lyrics">Lyrics</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       LYRICS
       ------------------------------------------------------- */

    lyrics: {
      title: "Lyrics",

      content: `
        ${renderPageHero(
          "Lyrics",
          "Read Christian song lyrics.",
          renderAction(
            "Create Lyrics",
            "create-lyric"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📜",
            "Song Lyrics",
            "Browse available Christian lyrics."
          )}

          ${renderCard(
            "🔎",
            "Search Lyrics",
            "Find lyrics by song or artist."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       VIDEOS
       ------------------------------------------------------- */

    videos: {
      title: "Videos",

      content: `
        ${renderPageHero(
          "Videos",
          "Watch Christian videos, teachings and sermons.",
          renderAction(
            "Upload Video",
            "upload-video"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "▶️",
            "Christian Videos",
            "Watch Christian media."
          )}

          ${renderCard(
            "🎙️",
            "Video Sermons",
            "Watch sermons and messages."
          )}

          ${renderCard(
            "📚",
            "Bible Lessons",
            "Learn through Christian video lessons."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       LIVE
       ------------------------------------------------------- */

    live: {
      title: "Live",

      content: `
        ${renderPageHero(
          "Live",
          "Watch live Christian programs and events."
        )}

        <section class="content-grid">

          ${renderCard(
            "🔴",
            "Live Now",
            "Live broadcasts will appear here."
          )}

          ${renderCard(
            "📅",
            "Upcoming",
            "See upcoming live Christian programs."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       COMMUNITY
       ------------------------------------------------------- */

    community: {
      title: "Community",

      content: `
        ${renderPageHero(
          "Community",
          "Connect, encourage one another and grow together."
        )}

        <section class="content-grid">

          ${renderCard(
            "👥",
            "Christian Community",
            "Connect with other believers."
          )}

          ${renderCard(
            "💬",
            "Discussions",
            "Share thoughts and Christian encouragement."
          )}

          ${renderCard(
            "🙏",
            "Prayer",
            "Encourage one another through prayer."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       Q&A
       ------------------------------------------------------- */

    qa: {
      title: "Bible Q&A",

      content: `
        ${renderPageHero(
          "Bible Q&A",
          "Ask questions and explore biblical answers."
        )}

        <section class="content-grid">

          ${renderCard(
            "❓",
            "Ask a Question",
            "Submit a Bible-related question."
          )}

          ${renderCard(
            "📖",
            "Answers",
            "Explore answers to common Bible questions."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       EVENTS
       ------------------------------------------------------- */

    events: {
      title: "Events",

      content: `
        ${renderPageHero(
          "Events",
          "Christian events, meetings and programs.",
          renderAction(
            "Create Event",
            "create-event"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📅",
            "Upcoming Events",
            "See upcoming Christian events."
          )}

          ${renderCard(
            "⛪",
            "Church Programs",
            "Discover Christian programs and gatherings."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       PLAYLISTS
       ------------------------------------------------------- */

    playlists: {
      title: "Playlists",

      content: `
        ${renderPageHero(
          "Playlists",
          "Create and organize your favorite Christian media.",
          renderAction(
            "Create Playlist",
            "create-playlist"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "☷",
            "My Playlists",
            "Your personal playlists will appear here."
          )}

          ${renderCard(
            "🎵",
            "Worship Playlist",
            "Organize worship songs for listening."
          )}

          ${renderCard(
            "🎙️",
            "Sermon Playlist",
            "Keep your favorite sermons together."
          )}

        </section>
      `
    },
         /* -------------------------------------------------------
       ARTISTS
       ------------------------------------------------------- */

    artists: {
      title: "Artists",

      content: `
        ${renderPageHero(
          "Artists",
          "Discover Christian worship artists and musicians."
        )}

        <section class="content-grid">

          ${renderCard(
            "🎤",
            "Christian Artists",
            "Explore artists and worship musicians."
          )}

          ${renderCard(
            "🎵",
            "Music",
            "Listen to songs from Christian artists."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       COURSES
       ------------------------------------------------------- */

    courses: {
      title: "Courses",

      content: `
        ${renderPageHero(
          "Courses",
          "Learn through structured Christian courses.",
          renderAction(
            "Create Course",
            "create-course"
          ) +
          renderAction(
            "Upload Course",
            "upload-course"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎓",
            "Bible Courses",
            "Explore structured Bible and Christian courses."
          )}

          ${renderCard(
            "📚",
            "Learning Materials",
            "Study Christian learning materials."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       PROFILE
       ------------------------------------------------------- */

    profile: {
      title: "Profile",

      content: `
        ${renderPageHero(
          "Profile",
          "Manage your Apostolic Media profile."
        )}

        <section class="content-grid">

          ${renderCard(
            "👤",
            "My Profile",
            "View and manage your profile information."
          )}

          ${renderCard(
            "♡",
            "Saved",
            "Access your saved Christian content.",
            `<a class="btn" href="#saved">Open Saved</a>`
          )}

          ${renderCard(
            "⇩",
            "Downloads",
            "Access your downloaded content.",
            `<a class="btn" href="#downloads">Downloads</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       NOTIFICATIONS
       ------------------------------------------------------- */

    notifications: {
      title: "Notifications",

      content: `
        ${renderPageHero(
          "Notifications",
          "Stay informed about new Christian content and activity."
        )}

        <section class="content-grid">

          ${renderCard(
            "♧",
            "Recent Notifications",
            "Your recent notifications will appear here."
          )}

          ${renderCard(
            "🔔",
            "Updates",
            "Receive important updates from Apostolic Media."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       DOWNLOADS
       ------------------------------------------------------- */

    downloads: {
      title: "Downloads",

      content: `
        ${renderPageHero(
          "Downloads",
          "Access content you have downloaded."
        )}

        <section class="content-grid">

          ${renderCard(
            "⇩",
            "Downloaded Content",
            "Your downloaded songs, videos and documents will appear here."
          )}

          ${renderCard(
            "📁",
            "Files",
            "Manage your downloaded Christian resources."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SAVED
       ------------------------------------------------------- */

    saved: {
      title: "Saved",

      content: `
        ${renderPageHero(
          "Saved",
          "Keep your favorite Christian content in one place."
        )}

        <section class="content-grid">

          ${renderCard(
            "♡",
            "Saved Content",
            "Your saved content will appear here."
          )}

          ${renderCard(
            "📖",
            "Saved Bible Verses",
            "Keep important Bible verses for later."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       CREATOR STUDIO
       ------------------------------------------------------- */

    creator: {
      title: "Creator Studio",

      content: `
        ${renderPageHero(
          "Creator Studio",
          "Create and manage Christian media content.",
          renderAction(
            "Upload Document",
            "upload-document"
          ) +
          renderAction(
            "Create Teaching",
            "create-teaching"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "◈",
            "Content",
            "Manage your Christian content."
          )}

          ${renderCard(
            "📊",
            "Creator Dashboard",
            "Monitor your content activity."
          )}

          ${renderCard(
            "📤",
            "Uploads",
            "Upload new Christian media."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       WALLET
       ------------------------------------------------------- */

    wallet: {
      title: "Wallet",

      content: `
        ${renderPageHero(
          "Wallet",
          "Manage your support and creator transactions."
        )}

        <section class="content-grid">

          ${renderCard(
            "◇",
            "Wallet Balance",
            "Your wallet balance will appear here."
          )}

          ${renderCard(
            "💳",
            "Transactions",
            "View your transaction history."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       ADMIN
       ------------------------------------------------------- */

    admin: {
      title: "Admin",

      content: `
        ${renderPageHero(
          "Admin",
          "Manage the Apostolic Media platform."
        )}

        <section class="content-grid">

          ${renderCard(
            "⚙️",
            "Platform Management",
            "Manage platform settings and content."
          )}

          ${renderCard(
            "👥",
            "Users",
            "Manage platform users."
          )}

          ${renderCard(
            "📊",
            "Analytics",
            "View platform activity and statistics."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SETTINGS
       ------------------------------------------------------- */

    settings: {
      title: "Settings",

      content: `
        ${renderPageHero(
          "Settings",
          "Customize your Apostolic Media experience."
        )}

        <section class="content-grid">

          ${renderCard(
            "◐",
            "Theme",
            "Change between light, dark and system themes."
          )}

          ${renderCard(
            "文",
            "Language",
            "Choose your preferred language."
          )}

          ${renderCard(
            "🔔",
            "Notifications",
            "Manage notification preferences."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       ABOUT
       ------------------------------------------------------- */

    about: {
      title: "About",

      content: `
        ${renderPageHero(
          "About Apostolic Media",
          "A Christian digital platform for Bible, worship, teachings, sermons and community."
        )}

        <section class="content-grid">

          ${renderCard(
            "🕎",
            "Apostolic Media",
            "የኢየሱስ ልጆች Apostolic Media"
          )}

          ${renderCard(
            "📖",
            "Our Purpose",
            "To make Christian resources easier to discover, study and share."
          )}

          ${renderCard(
            "❤️",
            "Our Mission",
            "To encourage people to grow in the Word of God and connect with the Christian community."
          )}

        </section>
      `
    }

  };

  /* =========================================================
     RENDER PAGE
     ========================================================= */

  function renderPage(route) {
    const main =
      $("#mainContent");

    if (!main) return;

    const cleanRoute =
      String(route || "home")
        .replace(/^#/, "")
        .trim();

    const page =
      pages[cleanRoute] ||
      pages.home;

    activateNavigation(
      cleanRoute
    );

    /*
      Important:
      mainContent itself remains the main page container.
      We only replace its contents.
    */

    main.innerHTML = `
      <div class="page-container">
        ${page.content}
      </div>
    `;

    initThemeControls();
    initLanguageControls();

    /*
      Always bring the newly selected page
      to the top.
    */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }

  /* =========================================================
     ROUTER INITIALIZATION
     ========================================================= */

  function initRouter() {

    window.addEventListener(
      "pageLoad",
      function (event) {

        const route =
          event.detail &&
          event.detail.route
            ? event.detail.route
            : window.location.hash;

        renderPage(route);
      }
    );

    const initialRoute =
      window.location.hash
        ? window.location.hash.substring(1)
        : "home";

    if (window.ApostolicRouter) {

      /*
        router.js supports start().
        This is intentionally NOT init().
      */

      window.ApostolicRouter.start();

      /*
        If the current hash is empty,
        explicitly load Home.
      */

      if (!window.location.hash) {
        window.ApostolicRouter.navigate(
          "#home",
          true
        );
      }

    } else {

      renderPage(
        initialRoute
      );
    }
  }

  /* =========================================================
     GENERAL ACTIONS
     ========================================================= */

  function initActions() {

    $$(
      "[data-action]"
    ).forEach(function (element) {

      if (
        element.dataset.actionBound
      ) {
        return;
      }

      const action =
        element.dataset.action;

      if (
        action ===
        "toggle-sidebar"
      ) {
        element.dataset.actionBound =
          "true";

        return;
      }

      if (
        action ===
        "toggle-theme"
      ) {
        element.dataset.actionBound =
          "true";

        element.addEventListener(
          "click",
          function () {
            theme.toggle();
          }
        );

        return;
      }

      if (
        action ===
        "language"
      ) {
        element.dataset.actionBound =
          "true";

        element.addEventListener(
          "click",
          function () {

            const current =
              language.get();

            if (current === "en") {
              language.set("am");
              toast(
                "Language changed to አማርኛ.",
                "success"
              );
            } else {
              language.set("en");
              toast(
                "Language changed to English.",
                "success"
              );
            }

          }
        );
      }
    });
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  function init() {

    theme.init();

    language.init();

    initMobileMenu();

    initNavigation();

    initSearch();

    initThemeControls();

    initLanguageControls();

    initPageActionDelegation();

    initActions();

    initBackToTop();

    initConnectionStatus();

    initServiceWorker();

    initKeyboardShortcuts();

    initVisibility();

    initErrorHandling();

    initRouter();

    window.dispatchEvent(
      new CustomEvent(
        "apostolic:ready",
        {
          detail: {
            app: APP
          }
        }
      )
    );
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.ApostolicApp = {

    version:
      APP.version,

    navigate,

    renderPage,

    toast,

    theme,

    language,

    storage,

    getAppInfo() {
      return {
        name: APP.name,
        version: APP.version
      };
    }
  };

  /* =========================================================
     START APPLICATION
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }

})();
