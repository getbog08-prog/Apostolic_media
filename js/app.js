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
        /* Storage may be unavailable */
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
      return storage.get("apostolic_theme", APP.defaultTheme);
    },

    set(value) {
      const allowed = ["light", "dark", "system"];

      if (!allowed.includes(value)) {
        value = APP.defaultTheme;
      }

      document.documentElement.setAttribute("data-theme", value);
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

      storage.set("apostolic_language", value);

      document.documentElement.setAttribute(
        "lang",
        value === "am"
          ? "am"
          : value === "om"
          ? "om"
          : "en"
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

  /* -------------------------------------------------------
     Mobile Menu
     ------------------------------------------------------- */

  function initMobileMenu() {
    const menuButton =
      $(".menu-btn") ||
      $("[data-menu-toggle]") ||
      $(".mobile-menu-button");

    const sidebar =
      $(".sidebar") ||
      $("[data-sidebar]");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuButton.classList.toggle("active");

      const isOpen = sidebar.classList.contains("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    $$(".nav-item, .sidebar a").forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove("open");
          menuButton.classList.remove("active");
        }
      });
    });
  }

  /* -------------------------------------------------------
     Navigation
     ------------------------------------------------------- */

  function initNavigation() {
    const links = $$(
      "[data-route], [data-page], .nav-item"
    );

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const route =
          link.dataset.route ||
          link.dataset.page;

        if (!route) return;

        event.preventDefault();

        navigate(route);
      });
    });

    window.addEventListener("popstate", () => {
      const route =
        window.location.hash.replace("#", "") ||
        "home";

      activateNavigation(route);
    });
  }

  function navigate(route) {
    if (!route) return;

    const cleanRoute = String(route)
      .replace(/^#/, "")
      .trim();

    history.pushState(
      { route: cleanRoute },
      "",
      "#" + cleanRoute
    );

    activateNavigation(cleanRoute);

    window.dispatchEvent(
      new CustomEvent("apostolic:navigate", {
        detail: { route: cleanRoute }
      })
    );
  }

  function activateNavigation(route) {
    $$(
      ".nav-item.active, [data-route].active, [data-page].active"
    ).forEach((item) => {
      item.classList.remove("active");
    });

    $$(
      `[data-route="${route}"], [data-page="${route}"]`
    ).forEach((item) => {
      item.classList.add("active");
    });

    const target =
      document.getElementById(route);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  /* -------------------------------------------------------
     Search
     ------------------------------------------------------- */

  function initSearch() {
    const inputs = $$(
      'input[type="search"], .search-input, [data-search]'
    );

    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        const query = input.value.trim();

        window.dispatchEvent(
          new CustomEvent("apostolic:search", {
            detail: { query }
          })
        );
      });

      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;

        const query = input.value.trim();

        if (!query) return;

        window.dispatchEvent(
          new CustomEvent("apostolic:searchsubmit", {
            detail: { query }
          })
        );
      });
    });
  }

  /* -------------------------------------------------------
     Theme Controls
     ------------------------------------------------------- */

  function initThemeControls() {
    $$(
      "[data-theme], [data-set-theme]"
    ).forEach((button) => {
      button.addEventListener("click", () => {
        const selected =
          button.dataset.theme ||
          button.dataset.setTheme;

        if (selected) {
          theme.set(selected);
        }
      });
    });

    $$(".theme-toggle, [data-theme-toggle]").forEach(
      (button) => {
        button.addEventListener("click", () => {
          theme.toggle();
        });
      }
    );
  }

  /* -------------------------------------------------------
     Language Controls
     ------------------------------------------------------- */

  function initLanguageControls() {
    $$(
      "[data-language], [data-set-language]"
    ).forEach((button) => {
      button.addEventListener("click", () => {
        const selected =
          button.dataset.language ||
          button.dataset.setLanguage;

        if (selected) {
          language.set(selected);
        }
      });
    });
  }

  /* -------------------------------------------------------
     Toast Notification
     ------------------------------------------------------- */

  function toast(message, type = "info") {
    let container = $(".toast-container");

    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const item = document.createElement("div");

    item.className = `toast toast-${type}`;

    item.setAttribute("role", "status");

    item.textContent = message;

    container.appendChild(item);

    requestAnimationFrame(() => {
      item.classList.add("show");
    });

    setTimeout(() => {
      item.classList.remove("show");

      setTimeout(() => {
        item.remove();
      }, 250);
    }, 3000);
  }

  /* -------------------------------------------------------
     Loading
     ------------------------------------------------------- */

  function setLoading(element, loading = true) {
    if (!element) return;

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
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");
    document.body.classList.add("modal-open");

    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (!$(".modal.open")) {
      document.body.classList.remove("modal-open");
    }
  }

  function initModals() {
    $$("[data-modal-open]").forEach((button) => {
      button.addEventListener("click", () => {
        openModal(button.dataset.modalOpen);
      });
    });

    $$("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => {
        closeModal(button.dataset.modalClose);
      });
    });

    $$(".modal").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      $$(".modal.open").forEach((modal) => {
        closeModal(modal.id);
      });
    });
  }

  /* -------------------------------------------------------
     Save / Like Buttons
     ------------------------------------------------------- */

  function initActions() {
    $$("[data-like]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.like;

        const liked = storage.get(
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
      });
    });

    $$("[data-save]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.save;

        const saved = storage.get(
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
      });
    });
  }

  /* -------------------------------------------------------
     Back To Top
     ------------------------------------------------------- */

  function initBackToTop() {
    const button =
      $(".back-to-top") ||
      $("[data-back-to-top]");

    if (!button) return;

    window.addEventListener("scroll", () => {
      button.classList.toggle(
        "visible",
        window.scrollY > 400
      );
    });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* -------------------------------------------------------
     Online / Offline Status
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
     Service Worker / PWA
     ------------------------------------------------------- */

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then(() => {
          console.log(
            "Apostolic Media service worker registered."
          );
        })
        .catch((error) => {
          console.warn(
            "Service worker registration failed:",
            error
          );
        });
    });
  }

  /* -------------------------------------------------------
     Global Keyboard Shortcuts
     ------------------------------------------------------- */

  function initKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(
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
    });
  }

  /* -------------------------------------------------------
     Page Visibility
     ------------------------------------------------------- */

  function initVisibility() {
    document.addEventListener(
      "visibilitychange",
      () => {
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
     Global Error Handler
     ------------------------------------------------------- */

  function initErrorHandling() {
    window.addEventListener(
      "error",
      (event) => {
        console.error(
          "Apostolic Media error:",
          event.error || event.message
        );
      }
    );

    window.addEventListener(
      "unhandledrejection",
      (event) => {
        console.error(
          "Unhandled promise rejection:",
          event.reason
        );
      }
    );
  }

  /* -------------------------------------------------------
     App Initialization
     ------------------------------------------------------- */

  function init() {
    theme.init();
    language.init();

    initMobileMenu();
    initNavigation();
    initSearch();

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
    closeModal
  };

  /* -------------------------------------------------------
     Start
     ------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
