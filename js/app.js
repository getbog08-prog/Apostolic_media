/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Main Application Controller
   ========================================================= */

(function () {
  "use strict";

  const APP = {
    name: "የኢየሱስ ልጆች Apostolic Media",
    version: "1.0.0",
    defaultTheme: "system",
    defaultLanguage: "en"
  };

  /* -------------------------------------------------------
     DOM Helpers
     ------------------------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* -------------------------------------------------------
     Storage
     ------------------------------------------------------- */

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
      } catch {
        /* Ignore storage errors */
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* Ignore */
      }
    }
  };

  /* -------------------------------------------------------
     Theme System
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Language System
     ------------------------------------------------------- */

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
            detail: { language: value }
          }
        )
      );
    },

    init() {
      this.set(this.get());
    }
  };

  /* -------------------------------------------------------
     Mobile Menu
     ------------------------------------------------------- */

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
        menuButton.classList.toggle("active");

        const isOpen =
          sidebar.classList.contains("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );

    $$(".nav-item, .sidebar a").forEach(
      function (item) {
        item.addEventListener(
          "click",
          function () {
            if (window.innerWidth < 1024) {
              sidebar.classList.remove("open");
              menuButton.classList.remove("active");
            }
          }
        );
      }
    );
  }

  /* -------------------------------------------------------
     Navigation
     IMPORTANT:
     Navigation is controlled by router.js.
     ------------------------------------------------------- */

  function initNavigation() {
    /*
      router.js handles navigation.
      We intentionally do not add another
      navigation click handler here.
    */
    return;
  }

  function navigate(route) {
    if (!route) {
      return;
    }

    const cleanRoute = String(route)
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
    const cleanRoute = String(route || "")
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

      const cleanTarget = String(target || "")
        .replace(/^#/, "")
        .trim();

      item.classList.toggle(
        "active",
        cleanTarget === cleanRoute
      );
    });
  }

  /* -------------------------------------------------------
     Search
     ------------------------------------------------------- */

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
                detail: { query }
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
                detail: { query }
              }
            )
          );
        }
      );
    });
  }

  /* -------------------------------------------------------
     Theme Controls
     ------------------------------------------------------- */

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

    $$(".theme-toggle, [data-theme-toggle]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            theme.toggle();
          }
        );
      });
  }

  /* -------------------------------------------------------
     Language Controls
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Toast
     ------------------------------------------------------- */

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

    item.textContent = message;

    container.appendChild(item);

    requestAnimationFrame(
      function () {
        item.classList.add("show");
      }
    );

    setTimeout(function () {
      item.classList.remove("show");

      setTimeout(function () {
        item.remove();
      }, 250);
    }, 3000);
  }

  /* -------------------------------------------------------
     Loading
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Modal
     ------------------------------------------------------- */

  function openModal(id) {
    const modal =
      document.getElementById(id);

    if (!modal) {
      return;
    }

    modal.classList.add("open");

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

    modal.classList.remove("open");

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
    $$("[data-modal-open]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            openModal(
              button.dataset.modalOpen
            );
          }
        );
      });

    $$("[data-modal-close]")
      .forEach(function (button) {
        button.addEventListener(
          "click",
          function () {
            closeModal(
              button.dataset.modalClose
            );
          }
        );
      });

    $$(".modal").forEach(
      function (modal) {
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
      }
    );

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

  /* -------------------------------------------------------
     Like / Save
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Back To Top
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Online / Offline
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Service Worker
     ------------------------------------------------------- */

  function registerServiceWorker() {
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

  /* -------------------------------------------------------
     Keyboard Shortcuts
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Visibility
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Error Handling
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Page Renderer
     ------------------------------------------------------- */

  function renderPage(page) {
    const main =
      document.getElementById(
        "mainContent"
      );

    if (!main) {
      return;
    }

    const pages = {

      home: {
        title:
          "Welcome to የኢየሱስ ልጆች",
        subtitle:
          "Apostolic Media",
        icon: "🕎",
        text:
          "Wherever you are, join the same Apostolic Christian community."
      },

      bible: {
        title:
          "Holy Bible",
        subtitle:
          "Read and study God's Word.",
        icon: "📖",
        text:
          "Bible resources, Scripture reading and Bible study will be available here."
      },

      "bible-study": {
        title:
          "Bible Study",
        subtitle:
          "Grow in the Word",
        icon: "📚",
        text:
          "Explore structured Bible studies and Scripture-based teaching."
      },

      teachings: {
        title:
          "Christian Teachings",
        subtitle:
          "Scripture-based teaching",
        icon: "📘",
        text:
          "Discover Apostolic Christian teachings and lessons."
      },

      sermons: {
        title:
          "Sermons",
        subtitle:
          "Messages for spiritual growth",
        icon: "🎙️",
        text:
          "Listen to sermons and messages from Christian ministers."
      },

      songs: {
        title:
          "Christian Songs",
        subtitle:
          "Worship and praise",
        icon: "🎵",
        text:
          "Discover Apostolic Christian worship songs."
      },

      lyrics: {
        title:
          "Lyrics",
        subtitle:
          "Christian song lyrics",
        icon: "📝",
        text:
          "Read Christian worship and praise lyrics."
      },

      videos: {
        title:
          "Christian Videos",
        subtitle:
          "Watch and learn",
        icon: "▶️",
        text:
          "Watch Apostolic Christian videos and ministry content."
      },

      community: {
        title:
          "Community",
        subtitle:
          "Connect with believers",
        icon: "👥",
        text:
          "Connect, share and communicate with the Apostolic Christian community."
      },

      live: {
        title:
          "Live",
        subtitle:
          "Live Christian ministry",
        icon: "🔴",
        text:
          "Live ministry and Christian broadcasts will appear here."
      },

      events: {
        title:
          "Events",
        subtitle:
          "Christian events",
        icon: "📅",
        text:
          "Discover upcoming Apostolic Christian events."
      },

      playlists: {
        title:
          "Playlists",
        subtitle:
          "Your Christian media",
        icon: "🎶",
        text:
          "Create and manage your favorite Christian media playlists."
      },

      artists: {
        title:
          "Artists & Ministers",
        subtitle:
          "Christian ministers and creators",
        icon: "🎤",
        text:
          "Explore Christian artists, ministers and creators."
      },

      courses: {
        title:
          "Courses",
        subtitle:
          "Christian learning",
        icon: "🎓",
        text:
          "Learn through structured Christian courses."
      }
    };

    const content =
      pages[page];

    if (!content) {
      main.innerHTML = `
        <section class="empty-state">
          <div class="empty-state-icon">
            🔎
          </div>

          <h2>Page not found</h2>

          <p>
            This section is not available yet.
          </p>

          <a
            href="#home"
            class="btn primary"
          >
            ← Home
          </a>
        </section>
      `;

      return;
    }

    main.innerHTML = `
      <section class="hero">
        <div class="hero-content">

          <span
            class="hero-icon"
            style="font-size:3rem;"
          >
            ${content.icon}
          </span>

          <span class="eyebrow">
            APOSTOLIC MEDIA
          </span>

          <h1>
            ${content.title}
          </h1>

          <p class="hero-subtitle">
            ${content.subtitle}
          </p>

          <p>
            ${content.text}
          </p>

          <div class="hero-actions">
            <a
              href="#home"
              class="btn primary"
            >
              ← Home
            </a>
          </div>

        </div>
      </section>
    `;
  }

  /* -------------------------------------------------------
     Router Integration
     ------------------------------------------------------- */

  function initRouter() {

    /*
      router.js sends pageLoad events.
    */

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

    /*
      Load router.js only if it has
      not already been loaded.
    */

    if (
      window.ApostolicRouter
    ) {
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

  /* -------------------------------------------------------
     App Initialization
     ------------------------------------------------------- */

  function init() {

    theme.init();

    language.init();

    initMobileMenu();

    /*
      Navigation is handled by router.js.
    */
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

  /* -------------------------------------------------------
     Public API
     ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     Start
     ------------------------------------------------------- */

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
