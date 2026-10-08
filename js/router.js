/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Application Router
   ========================================================= */

(function (window) {
  "use strict";

  const Router = {
    routes: {},
    currentRoute: null,
    started: false,

    register(path, handler) {
      const normalized = this.normalize(path);
      this.routes[normalized] = handler;
      return this;
    },

    registerMany(routes) {
      Object.keys(routes).forEach((path) => {
        this.register(path, routes[path]);
      });
      return this;
    },

    getHash() {
      return window.location.hash || "#home";
    },

    normalize(route) {
      let value = String(route || "#home").trim();

      if (value.startsWith("#")) {
        value = value.substring(1);
      }

      value = value.split("?")[0];
      value = value.replace(/^\/+|\/+$/g, "");

      return value || "home";
    },

    getParams(route) {
      const raw = String(route || "").replace(/^#/, "");
      const parts = raw.split("?");
      const name = this.normalize(parts[0]);
      const params = {};

      if (parts[1]) {
        const search = new URLSearchParams(parts[1]);

        search.forEach((value, key) => {
          params[key] = value;
        });
      }

      return {
        name,
        params
      };
    },

    navigate(route, replace = false) {
      const normalized = this.normalize(route);
      const hash = "#" + normalized;

      if (replace) {
        history.replaceState(null, "", hash);
        this.handle();
      } else {
        if (window.location.hash === hash) {
          this.handle();
        } else {
          window.location.hash = normalized;
        }
      }
    },

    back() {
      history.back();
    },

    handle() {
      const hash = this.getHash();
      const routeInfo = this.getParams(hash);
      const route = routeInfo.name;

      this.currentRoute = route;

      const handler =
        this.routes[route] ||
        this.routes["*"];

      if (typeof handler === "function") {
        try {
          handler(routeInfo);
        } catch (error) {
          console.error("Route error:", error);

          window.dispatchEvent(
            new CustomEvent("routeError", {
              detail: {
                route,
                error
              }
            })
          );
        }
      } else {
        this.showNotFound(route);
      }

      this.updateActiveNavigation(route);

      window.dispatchEvent(
        new CustomEvent("routeChanged", {
          detail: {
            route,
            name: routeInfo.name,
            params: routeInfo.params
          }
        })
      );
    },

    updateActiveNavigation(route) {
      document
        .querySelectorAll(
          "[data-route], [data-nav], a[href^='#']"
        )
        .forEach((element) => {

          const target =
            element.getAttribute("data-route") ||
            element.getAttribute("data-nav") ||
            element.getAttribute("href");

          if (!target) return;

          const normalized = this.normalize(target);
          const active = normalized === route;

          element.classList.toggle("active", active);

          element.setAttribute(
            "aria-current",
            active ? "page" : "false"
          );
        });
    },

    showNotFound(route) {
      const main = document.getElementById("mainContent");

      if (!main) return;

      main.innerHTML = `
        <section class="empty">
          <strong>Page not found</strong>
          <p>
            The page
            <strong>${this.escapeHTML(route)}</strong>
            is not available.
          </p>

          <div class="hero-actions">
            <a href="#home" class="btn primary">
              ← Home
            </a>
          </div>
        </section>
      `;
    },

    showRouteError(route) {
      const main = document.getElementById("mainContent");

      if (!main) return;

      main.innerHTML = `
        <section class="empty">
          <strong>Something went wrong</strong>

          <p>
            We could not load this section.
          </p>

          <div class="hero-actions">
            <a href="#home" class="btn primary">
              ← Home
            </a>

            <button
              type="button"
              class="btn"
              onclick="location.reload()">
              Reload
            </button>
          </div>
        </section>
      `;

      console.error("Could not load route:", route);
    },

    escapeHTML(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    start() {
      if (this.started) return;

      this.started = true;

      window.addEventListener(
        "hashchange",
        () => this.handle()
      );

      window.addEventListener(
        "popstate",
        () => this.handle()
      );

      document.addEventListener("click", (event) => {

        const link = event.target.closest(
          "[data-route], [data-nav], a[href^='#']"
        );

        if (!link) return;

        const route =
          link.getAttribute("data-route") ||
          link.getAttribute("data-nav") ||
          link.getAttribute("href");

        if (!route || route === "#") return;

        if (
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();

        this.navigate(route);
      });

      this.handle();
    },

    /* Compatibility with app.js */
    init() {
      this.start();
    }
  };


  /* =========================================================
     Route helper
     ========================================================= */

  function page(name) {
    return function (routeInfo) {
      window.dispatchEvent(
        new CustomEvent("pageLoad", {
          detail: {
            route: name,
            page: name,
            params: routeInfo
              ? routeInfo.params
              : {}
          }
        })
      );
    };
  }


  /* =========================================================
     Main pages
     ========================================================= */

  Router.registerMany({

    home: page("home"),

    songs: page("songs"),

    lyrics: page("lyrics"),

    artists: page("artists"),

    teachings: page("teachings"),

    sermons: page("sermons"),

    bible: page("bible"),

    "bible-study": page("bible-study"),

    courses: page("courses"),

    videos: page("videos"),

    live: page("live"),

    community: page("community"),

    qa: page("qa"),

    events: page("events"),

    playlists: page("playlists"),

    folders: page("folders"),


    /* =====================================================
       User pages
       ===================================================== */

    profile: page("profile"),

    notifications: page("notifications"),

    downloads: page("downloads"),

    saved: page("saved"),

    settings: page("settings"),


    /* =====================================================
       Creator pages
       ===================================================== */

    creator: page("creator"),

    wallet: page("wallet"),


    /* =====================================================
       Administration
       ===================================================== */

    admin: page("admin"),


    /* =====================================================
       Information
       ===================================================== */

    about: page("about")
  });


  /* =========================================================
     Fallback
     ========================================================= */

  Router.register("*", function (routeInfo) {
    Router.showNotFound(
      routeInfo
        ? routeInfo.name
        : "unknown"
    );
  });


  /* =========================================================
     Global access
     ========================================================= */

  window.ApostolicRouter = Router;
  window.Router = Router;

})(window);
