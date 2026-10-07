/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Main Application Controller
   ========================================================= */

(function () {
  "use strict";

  const APP = {
    name: "የኢየሱስ ልጆች Apostolic Media",
    version: "1.1.0",
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
      } catch {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {}
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {}
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
      const allowed = [
        "light",
        "dark",
        "system"
      ];

      if (!allowed.includes(value)) {
        value = APP.defaultTheme;
      }

      document.documentElement.setAttribute(
        "data-theme",
        value
      );

      storage.set(
        "apostolic_theme",
        value
      );

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:themechange",
          {
            detail: {
              theme: value
            }
          }
        )
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
      const allowed = [
        "am",
        "en",
        "om"
      ];

      if (!allowed.includes(value)) {
        value = APP.defaultLanguage;
      }

      storage.set(
        "apostolic_language",
        value
      );

      document.documentElement.setAttribute(
        "lang",
        value
      );

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:languagechange",
          {
            detail: {
              language: value
            }
          }
        )
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

    if (!menuButton || !sidebar) {
      return;
    }

    menuButton.addEventListener(
      "click",
      function () {

        sidebar.classList.toggle("open");

        menuButton.classList.toggle(
          "active"
        );

        const isOpen =
          sidebar.classList.contains("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );

    $$(".nav-item, .sidebar a")
      .forEach(function (item) {

        item.addEventListener(
          "click",
          function () {

            if (window.innerWidth < 1024) {

              sidebar.classList.remove(
                "open"
              );

              menuButton.classList.remove(
                "active"
              );
            }
          }
        );
      });
  }


  /* =========================================================
     NAVIGATION
     ========================================================= */

  function initNavigation() {
    return;
  }

  function navigate(route) {

    if (!route) {
      return;
    }

    const cleanRoute =
      String(route)
        .replace(/^#/, "")
        .trim();

    if (window.ApostolicRouter) {

      window.ApostolicRouter.navigate(
        "#" + cleanRoute
      );

    } else {

      window.location.hash =
        cleanRoute;
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

      input.addEventListener(
        "input",
        function () {

          const query =
            input.value.trim();

          window.dispatchEvent(
            new CustomEvent(
              "apostolic:search",
              {
                detail: {
                  query
                }
              }
            )
          );
        }
      );

      input.addEventListener(
        "keydown",
        function (event) {

          if (event.key !== "Enter") {
            return;
          }

          const query =
            input.value.trim();

          if (!query) {
            return;
          }

          window.dispatchEvent(
            new CustomEvent(
              "apostolic:searchsubmit",
              {
                detail: {
                  query
                }
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

    $$(
      "[data-theme], [data-set-theme]"
    ).forEach(function (button) {

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

    $$(
      ".theme-toggle, [data-theme-toggle]"
    ).forEach(function (button) {

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

    $$(
      "[data-language], [data-set-language]"
    ).forEach(function (button) {

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
      $(".toast-container");

    if (!container) {

      container =
        document.createElement("div");

      container.className =
        "toast-container";

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

    item.textContent =
      message;

    container.appendChild(
      item
    );

    requestAnimationFrame(
      function () {
        item.classList.add(
          "show"
        );
      }
    );

    setTimeout(
      function () {

        item.classList.remove(
          "show"
        );

        setTimeout(
          function () {
            item.remove();
          },
          250
        );

      },
      3000
    );
  }


  /* =========================================================
     LOADING
     ========================================================= */

  function setLoading(
    element,
    loading = true
  ) {

    if (!element) {
      return;
    }

    element.classList.toggle(
      "is-loading",
      loading
    );

    element.setAttribute(
      "aria-busy",
      String(loading)
    );
  }


  /* =========================================================
     MODALS
     ========================================================= */

  function openModal(id) {

    const modal =
      document.getElementById(id);

    if (!modal) {
      return;
    }

    modal.classList.add(
      "open"
    );

    document.body.classList.add(
      "modal-open"
    );

    modal.setAttribute(
      "aria-hidden",
      "false"
    );
  }


  function closeModal(id) {

    const modal =
      document.getElementById(id);

    if (!modal) {
      return;
    }

    modal.classList.remove(
      "open"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    if (!$(".modal.open")) {
      document.body.classList.remove(
        "modal-open"
      );
    }
  }


  function initModals() {

    $$(
      "[data-modal-open]"
    ).forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          openModal(
            button.dataset.modalOpen
          );
        }
      );
    });


    $$(
      "[data-modal-close]"
    ).forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          closeModal(
            button.dataset.modalClose
          );
        }
      );
    });


    $$(".modal")
      .forEach(function (modal) {

        modal.addEventListener(
          "click",
          function (event) {

            if (
              event.target === modal
            ) {
              closeModal(
                modal.id
              );
            }
          }
        );
      });


    document.addEventListener(
      "keydown",
      function (event) {

        if (event.key !== "Escape") {
          return;
        }

        $$(".modal.open")
          .forEach(function (modal) {

            closeModal(
              modal.id
            );
          });
      }
    );
  }


  /* =========================================================
     LIKE / SAVE ACTIONS
     ========================================================= */

  function initActions() {

    $$("[data-like]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              button.dataset.like;

            const liked =
              storage.get(
                `liked_${id}`,
                false
              );

            storage.set(
              `liked_${id}`,
              !liked
            );

            button.classList.toggle(
              "active",
              !liked
            );

            toast(
              !liked
                ? "Added to liked content."
                : "Removed from liked content.",
              "success"
            );
          }
        );
      });


    $$("[data-save]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const id =
              button.dataset.save;

            const saved =
              storage.get(
                `saved_${id}`,
                false
              );

            storage.set(
              `saved_${id}`,
              !saved
            );

            button.classList.toggle(
              "active",
              !saved
            );

            toast(
              !saved
                ? "Saved successfully."
                : "Removed from saved content.",
              "success"
            );
          }
        );
      });
  }


  /* =========================================================
     BACK TO TOP
     ========================================================= */

  function initBackToTop() {

    const button =
      $(".back-to-top") ||
      $("[data-back-to-top]");

    if (!button) {
      return;
    }

    window.addEventListener(
      "scroll",
      function () {

        button.classList.toggle(
          "visible",
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

  function updateConnectionStatus() {

    document.body.classList.toggle(
      "offline",
      !navigator.onLine
    );

    document.body.classList.toggle(
      "online",
      navigator.onLine
    );
  }


  function initConnectionStatus() {

    updateConnectionStatus();

    window.addEventListener(
      "online",
      updateConnectionStatus
    );

    window.addEventListener(
      "offline",
      updateConnectionStatus
    );
  }


  /* =========================================================
     SERVICE WORKER
     ========================================================= */

  function registerServiceWorker() {

    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener(
      "load",
      function () {

        navigator.serviceWorker
          .register("./sw.js")
          .then(function () {

            console.log(
              "Apostolic Media service worker registered."
            );

          })
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
     KEYBOARD SHORTCUTS
     ========================================================= */

  function initKeyboardShortcuts() {

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "/" &&
          ![
            "INPUT",
            "TEXTAREA"
          ].includes(
            document.activeElement.tagName
          )
        ) {

          event.preventDefault();

          const search =
            $('input[type="search"]') ||
            $(".search-input");

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
          "Unhandled promise rejection:",
          event.reason
        );
      }
    );
  }


  /* =========================================================
     PAGE DATA
     ========================================================= */

  const pages = {

    home: {
      title: "Welcome to የኢየሱስ ልጆች",
      subtitle: "Apostolic Media",
      icon: "🕎",
      text:
        "Wherever you are, join the same Apostolic Christian community.",
      actions: [
        {
          label: "Explore Bible",
          route: "bible"
        },
        {
          label: "Browse Songs",
          route: "songs"
        }
      ]
    },


    bible: {
      title: "Holy Bible",
      subtitle: "Read and study God's Word.",
      icon: "📖",
      text:
        "Bible resources, Scripture reading and Bible study.",
      actions: [
        {
          label: "Bible Study",
          route: "bible-study"
        }
      ]
    },


    "bible-study": {
      title: "Bible Study",
      subtitle: "Grow in the Word",
      icon: "📚",
      text:
        "Explore structured Bible studies and Scripture-based teaching.",
      actions: [
        {
          label: "View Teachings",
          route: "teachings"
        }
      ]
    },


    teachings: {
      title: "Christian Teachings",
      subtitle: "Scripture-based teaching",
      icon: "📘",
      text:
        "Discover Apostolic Christian teachings and lessons.",
      actions: [
        {
          label: "Create Teaching",
          action: "create-teaching"
        },
        {
          label: "Upload Teaching",
          action: "upload-teaching"
        }
      ]
    },


    sermons: {
      title: "Sermons",
      subtitle: "Messages for spiritual growth",
      icon: "🎙️",
      text:
        "Listen to sermons and messages from Christian ministers.",
      actions: [
        {
          label: "Upload Sermon",
          action: "upload-sermon"
        }
      ]
    },


    songs: {
      title: "Christian Songs",
      subtitle: "Worship and praise",
      icon: "🎵",
      text:
        "Discover Apostolic Christian worship songs.",
      actions: [
        {
          label: "Upload Song",
          action: "upload-song"
        },
        {
          label: "View Lyrics",
          route: "lyrics"
        }
      ]
    },


    lyrics: {
      title: "Lyrics",
      subtitle: "Christian song lyrics",
      icon: "📝",
      text:
        "Read Christian worship and praise lyrics.",
      actions: [
        {
          label: "Add Lyrics",
          action: "add-lyrics"
        }
      ]
    },


    videos: {
      title: "Christian Videos",
      subtitle: "Watch and learn",
      icon: "▶️",
      text:
        "Watch Apostolic Christian videos and ministry content.",
      actions: [
        {
          label: "Upload Video",
          action: "upload-video"
        }
      ]
    },


    community: {
      title: "Community",
      subtitle: "Connect with believers",
      icon: "👥",
      text:
        "Connect, share and communicate with the Apostolic Christian community.",
      actions: [
        {
          label: "Create Post",
          action: "create-post"
        },
        {
          label: "Q&A",
          route: "qa"
        }
      ]
    },


    qa: {
      title: "Questions & Answers",
      subtitle: "Ask and learn together",
      icon: "❓",
      text:
        "Ask Christian questions and share Scripture-based answers.",
      actions: [
        {
          label: "Ask a Question",
          action: "ask-question"
        }
      ]
    },


    live: {
      title: "Live",
      subtitle: "Live Christian ministry",
      icon: "🔴",
      text:
        "Live ministry and Christian broadcasts will appear here.",
      actions: [
        {
          label: "Start Live",
          action: "start-live"
        }
      ]
    },


    events: {
      title: "Events",
      subtitle: "Christian events",
      icon: "📅",
      text:
        "Discover upcoming Apostolic Christian events.",
      actions: [
        {
          label: "Create Event",
          action: "create-event"
        }
      ]
    },


    playlists: {
      title: "Playlists",
      subtitle: "Your Christian media",
      icon: "🎶",
      text:
        "Create and manage your favorite Christian media playlists.",
      actions: [
        {
          label: "Create Playlist",
          action: "create-playlist"
        }
      ]
    },


    artists: {
      title: "Artists & Ministers",
      subtitle: "Christian ministers and creators",
      icon: "🎤",
      text:
        "Explore Christian artists, ministers and creators.",
      actions: [
        {
          label: "Creator Studio",
          route: "creator"
        }
      ]
    },


    courses: {
      title: "Courses",
      subtitle: "Christian learning",
      icon: "🎓",
      text:
        "Learn through structured Christian courses.",
      actions: [
        {
          label: "Create Course",
          action: "create-course"
        }
      ]
    },


    profile: {
      title: "My Profile",
      subtitle: "Your Apostolic Media profile",
      icon: "👤",
      text:
        "Manage your profile, ministry information and account settings.",
      actions: [
        {
          label: "Settings",
          route: "settings"
        }
      ]
    },


    notifications: {
      title: "Notifications",
      subtitle: "Stay updated",
      icon: "🔔",
      text:
        "Your latest Apostolic Media notifications will appear here."
    },


    downloads: {
      title: "Downloads",
      subtitle: "Offline Christian media",
      icon: "⬇️",
      text:
        "Access your downloaded Christian songs, teachings, videos and documents."
    },


    saved: {
      title: "Saved",
      subtitle: "Your saved content",
      icon: "🔖",
      text:
        "Find Christian content that you saved for later."
    },


    creator: {
      title: "Creator Studio",
      subtitle: "Create and manage Christian content",
      icon: "✨",
      text:
        "Create, upload and manage songs, teachings, sermons, videos and other ministry content.",
      actions: [
        {
          label: "Create Content",
          action: "create-content"
        },
        {
          label: "Upload Media",
          action: "upload-media"
        }
      ]
    },


    wallet: {
      title: "Wallet",
      subtitle: "Creator and ministry payments",
      icon: "💳",
      text:
        "Your creator wallet and future ministry payment features will appear here."
    },


    admin: {
      title: "Admin Dashboard",
      subtitle: "Manage Apostolic Media",
      icon: "🛡️",
      text:
        "Administration tools for content, users, moderation and platform management."
    },


    settings: {
      title: "Settings",
      subtitle: "Customize your Apostolic Media experience",
      icon: "⚙️",
      text:
        "Manage language, appearance, account and application preferences.",
      actions: [
        {
          label: "Light",
          action: "theme-light"
        },
        {
          label: "Dark",
          action: "theme-dark"
        },
        {
          label: "System",
          action: "theme-system"
        }
      ]
    },


    about: {
      title: "About",
      subtitle: "የኢየሱስ ልጆች Apostolic Media",
      icon: "ℹ️",
      text:
        "A digital Apostolic Christian community for worship, Bible study, teaching, fellowship and ministry."
    }

  };


  /* =========================================================
     ESCAPE HTML
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
     ACTION BUTTON
     ========================================================= */

  function renderAction(action) {

    const label =
      escapeHTML(action.label);

    if (action.route) {

      return `
        <a
          href="#${escapeHTML(action.route)}"
          class="btn primary">
          ${label}
        </a>
      `;
    }

    if (action.action) {

      return `
        <button
          type="button"
          class="btn primary"
          data-page-action="${escapeHTML(action.action)}">
          ${label}
        </button>
      `;
    }

    return "";
  }


  /* =========================================================
     RENDER PAGE
     ========================================================= */

  function renderPage(page) {

    const main =
      document.getElementById(
        "mainContent"
      );

    if (!main) {
      return;
    }

    const content =
      pages[page];


    if (!content) {

      main.innerHTML = `
        <section class="empty-state">

          <div class="empty-state-icon">
            🔎
          </div>

          <h2>
            Page not found
          </h2>

          <p>
            This section is not available yet.
          </p>

          <div class="hero-actions">

            <a
              href="#home"
              class="btn primary">
              ← Home
            </a>

          </div>

        </section>
      `;

      return;
    }


    const actions =
      (content.actions || [])
        .map(renderAction)
        .join("");


    main.innerHTML = `

      <section class="hero">

        <div class="hero-content">

          <span
            class="hero-icon"
            style="font-size:3rem;">
            ${content.icon}
          </span>

          <span class="eyebrow">
            APOSTOLIC MEDIA
          </span>

          <h1>
            ${escapeHTML(content.title)}
          </h1>

          <p class="hero-subtitle">
            ${escapeHTML(content.subtitle)}
          </p>

          <p>
            ${escapeHTML(content.text)}
          </p>


          ${
            actions
              ? `
                <div class="hero-actions">
                  ${actions}
                </div>
              `
              : ""
          }


          <div class="hero-actions">

            <a
              href="#home"
              class="btn secondary">
              ← Home
            </a>

          </div>

        </div>

      </section>

    `;

    initPageActions();
  }


  /* =========================================================
     PAGE ACTIONS
     ========================================================= */

  function initPageActions() {

    $$("[data-page-action]")
      .forEach(function (button) {

        button.addEventListener(
          "click",
          function () {

            const action =
              button.dataset.pageAction;

            handlePageAction(
              action
            );
          }
        );
      });
  }


  /* =========================================================
     CREATE / UPLOAD ACTIONS
     ========================================================= */

  function handlePageAction(action) {

    switch (action) {

      case "theme-light":
        theme.set("light");
        toast(
          "Light theme enabled.",
          "success"
        );
        break;


      case "theme-dark":
        theme.set("dark");
        toast(
          "Dark theme enabled.",
          "success"
        );
        break;


      case "theme-system":
        theme.set("system");
        toast(
          "System theme enabled.",
          "success"
        );
        break;


      case "create-teaching":
        showCreateForm(
          "Create Christian Teaching",
          "teaching"
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
          "Upload Christian Song",
          "song"
        );
        break;


      case "add-lyrics":
        showCreateForm(
          "Add Christian Lyrics",
          "lyrics"
        );
        break;


      case "upload-video":
        showUploadForm(
          "Upload Christian Video",
          "video"
        );
        break;


      case "create-post":
        showCreateForm(
          "Create Community Post",
          "post"
        );
        break;


      case "ask-question":
        showCreateForm(
          "Ask a Christian Question",
          "question"
        );
        break;


      case "start-live":
        showCreateForm(
          "Start Live Ministry",
          "live"
        );
        break;


      case "create-event":
        showCreateForm(
          "Create Christian Event",
          "event"
        );
        break;


      case "create-playlist":
        showCreateForm(
          "Create Playlist",
          "playlist"
        );
        break;


      case "create-course":
        showCreateForm(
          "Create Christian Course",
          "course"
        );
        break;


      case "create-content":
        showCreateForm(
          "Create Christian Content",
          "content"
        );
        break;


      case "upload-media":
        showUploadForm(
          "Upload Ministry Media",
          "media"
        );
        break;


      default:
        toast(
          "This feature is being prepared.",
          "info"
        );
    }
  }


  /* =========================================================
     CREATE FORM
     ========================================================= */

  function showCreateForm(
    title,
    type
  ) {

    const modal =
      createDynamicModal(
        title
      );

    const form =
      modal.querySelector(
        "form"
      );

    form.innerHTML = `

      <div class="form-group">

        <label>
          Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="Enter title"
          required>

      </div>


      <div class="form-group">

        <label>
          Description
        </label>

        <textarea
          name="description"
          rows="5"
          placeholder="Write your content..."
          required></textarea>

      </div>


      <div class="form-actions">

        <button
          type="submit"
          class="btn primary">
          Create
        </button>

        <button
          type="button"
          class="btn secondary"
          data-close-dynamic>
          Cancel
        </button>

      </div>

    `;


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const formData =
          new FormData(form);

        const item = {
          id:
            Date.now().toString(),

          type,

          title:
            formData.get("title"),

          description:
            formData.get("description"),

          createdAt:
            new Date().toISOString()
        };


        const existing =
          storage.get(
            "apostolic_created_content",
            []
          );

        existing.push(item);

        storage.set(
          "apostolic_created_content",
          existing
        );

        closeDynamicModal(
          modal
        );

        toast(
          "Content created successfully.",
          "success"
        );
      }
    );


    modal
      .querySelector(
        "[data-close-dynamic]"
      )
      .addEventListener(
        "click",
        function () {
          closeDynamicModal(
            modal
          );
        }
      );
  }


  /* =========================================================
     UPLOAD FORM
     ========================================================= */

  function showUploadForm(
    title,
    type
  ) {

    const modal =
      createDynamicModal(
        title
      );

    const form =
      modal.querySelector(
        "form"
      );

    form.innerHTML = `

      <div class="form-group">

        <label>
          Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="Enter title"
          required>

      </div>


      <div class="form-group">

        <label>
          Description
        </label>

        <textarea
          name="description"
          rows="4"
          placeholder="Optional description"></textarea>

      </div>


      <div class="form-group">

        <label>
          Select file
        </label>

        <input
          type="file"
          name="file"
          required>

      </div>


      <div class="form-actions">

        <button
          type="submit"
          class="btn primary">
          Upload
        </button>

        <button
          type="button"
          class="btn secondary"
          data-close-dynamic>
          Cancel
        </button>

      </div>

    `;


    form.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        const formData =
          new FormData(form);

        const file =
          formData.get("file");


        const uploadInfo = {

          id:
            Date.now().toString(),

          type,

          title:
            formData.get("title"),

          description:
            formData.get("description"),

          filename:
            file && file.name
              ? file.name
              : "",

          size:
            file && file.size
              ? file.size
              : 0,

          createdAt:
            new Date().toISOString()
        };


        const existing =
          storage.get(
            "apostolic_uploads",
            []
          );

        existing.push(
          uploadInfo
        );

        storage.set(
          "apostolic_uploads",
          existing
        );


        closeDynamicModal(
          modal
        );


        toast(
          "File selected successfully. Cloud upload will be connected later.",
          "success"
        );
      }
    );


    modal
      .querySelector(
        "[data-close-dynamic]"
      )
      .addEventListener(
        "click",
        function () {

          closeDynamicModal(
            modal
          );
        }
      );
  }


  /* =========================================================
     DYNAMIC MODAL
     ========================================================= */

  function createDynamicModal(
    title
  ) {

    const modal =
      document.createElement(
        "div"
      );

    modal.className =
      "modal open apostolic-dynamic-modal";

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    modal.innerHTML = `

      <div class="modal-content">

        <div class="modal-header">

          <h2>
            ${escapeHTML(title)}
          </h2>

          <button
            type="button"
            class="modal-close"
            data-close-dynamic
            aria-label="Close">
            ×
          </button>

        </div>


        <form>

        </form>

      </div>

    `;


    document.body.appendChild(
      modal
    );

    document.body.classList.add(
      "modal-open"
    );


    modal.addEventListener(
      "click",
      function (event) {

        if (
          event.target === modal
        ) {
          closeDynamicModal(
            modal
          );
        }
      }
    );


    modal
      .querySelector(
        ".modal-close"
      )
      .addEventListener(
        "click",
        function () {

          closeDynamicModal(
            modal
          );
        }
      );


    return modal;
  }


  function closeDynamicModal(
    modal
  ) {

    if (!modal) {
      return;
    }

    modal.remove();

    if (!$(".modal.open")) {

      document.body.classList.remove(
        "modal-open"
      );
    }
  }


  /* =========================================================
     ROUTER
     ========================================================= */

  function initRouter() {

    window.addEventListener(
      "pageLoad",
      function (event) {

        if (
          !event.detail ||
          !event.detail.page
        ) {
          return;
        }

        renderPage(
          event.detail.page
        );

        activateNavigation(
          event.detail.page
        );
      }
    );


    window.addEventListener(
      "routeError",
      function (event) {

        console.error(
          "Route error:",
          event.detail
        );
      }
    );


    if (window.ApostolicRouter) {

      window.ApostolicRouter.start();

      return;
    }


    const existingScript =
      document.querySelector(
        'script[src$="js/router.js"]'
      );


    if (existingScript) {

      existingScript.addEventListener(
        "load",
        function () {

          if (
            window.ApostolicRouter
          ) {

            window.ApostolicRouter.start();
          }
        }
      );

      return;
    }


    const script =
      document.createElement(
        "script"
      );

    script.src =
      "./js/router.js";


    script.onload =
      function () {

        if (
          window.ApostolicRouter
        ) {

          window.ApostolicRouter.start();
        }
      };


    script.onerror =
      function () {

        console.error(
          "Could not load js/router.js"
        );
      };


    document.head.appendChild(
      script
    );
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

    initRouter();

    initThemeControls();

    initLanguageControls();

    initModals();

    initActions();

    initBackToTop();

    initConnectionStatus();

    initKeyboardShortcuts();

    initVisibility();

    initErrorHandling();

    registerServiceWorker();


    document.body.classList.add(
      "app-ready"
    );


    console.log(
      `${APP.name} v${APP.version} initialized.`
    );
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.ApostolicMedia = {

    APP,

    storage,

    theme,

    language,

    navigate,

    toast,

    setLoading,

    openModal,

    closeModal,

    renderPage

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
      init
    );

  } else {

    init();
  }

})();
