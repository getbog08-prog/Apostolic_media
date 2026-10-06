/* =========================================================
   Apostolic Media
   Application Router
   File: js/router.js
   ========================================================= */

(function (window) {
  "use strict";

  const Router = {

    // =======================================================
    // Configuration
    // =======================================================
    routes: {},
    currentRoute: null,
    started: false,

    // =======================================================
    // Register a route
    // =======================================================
    register: function (path, handler) {
      if (!path || typeof handler !== "function") {
        return false;
      }

      this.routes[path] = handler;
      return true;
    },

    // =======================================================
    // Register multiple routes
    // =======================================================
    registerMany: function (routes) {
      if (!routes || typeof routes !== "object") {
        return;
      }

      Object.keys(routes).forEach((path) => {
        this.register(path, routes[path]);
      });
    },

    // =======================================================
    // Get current hash
    // =======================================================
    getHash: function () {
      let hash = window.location.hash || "#home";

      if (!hash.startsWith("#")) {
        hash = "#" + hash;
      }

      return hash;
    },

    // =======================================================
    // Normalize route
    // =======================================================
    normalize: function (route) {
      if (!route) {
        return "#home";
      }

      let normalized = String(route).trim();

      if (!normalized.startsWith("#")) {
        normalized = "#" + normalized;
      }

      // Remove trailing slash
      normalized = normalized.replace(/\/+$/, "");

      if (normalized === "#") {
        normalized = "#home";
      }

      return normalized;
    },

    // =======================================================
    // Get route parameters
    // =======================================================
    getParams: function (route) {
      const normalized = this.normalize(route);
      const parts = normalized.substring(1).split("/");

      return {
        path: normalized,
        name: parts[0] || "home",
        params: parts.slice(1)
      };
    },

    // =======================================================
    // Navigate
    // =======================================================
    navigate: function (route, replace) {
      const normalized = this.normalize(route);

      if (replace) {
        const url =
          window.location.pathname +
          window.location.search +
          normalized;

        window.history.replaceState(
          {},
          "",
          url
        );

        this.handle();
        return;
      }

      if (window.location.hash !== normalized) {
        window.location.hash = normalized;
      } else {
        this.handle();
      }
    },

    // =======================================================
    // Go back
    // =======================================================
    back: function () {
      window.history.back();
    },

    // =======================================================
    // Handle current route
    // =======================================================
    handle: function () {
      const route = this.normalize(this.getHash());
      const routeInfo = this.getParams(route);

      this.currentRoute = route;

      const handler =
        this.routes[route] ||
        this.routes["#" + routeInfo.name] ||
        this.routes["*"];

      if (typeof handler === "function") {
        try {
          handler(routeInfo);
        } catch (error) {
          console.error(
            "Router handler error:",
            error
          );

          this.showRouteError(error);
        }
      } else {
        this.showNotFound();
      }

      // Update active navigation
      this.updateActiveNavigation(route);

      // Notify application
      window.dispatchEvent(
        new CustomEvent("routeChanged", {
          detail: {
            route: route,
            name: routeInfo.name,
            params: routeInfo.params
          }
        })
      );
    },

    // =======================================================
    // Update active navigation
    // =======================================================
    updateActiveNavigation: function (route) {
      document
        .querySelectorAll(
          "[data-route], [data-nav], a[href^='#']"
        )
        .forEach((element) => {
          const target =
            element.getAttribute("data-route") ||
            element.getAttribute("data-nav") ||
            element.getAttribute("href");

          const normalized =
            this.normalize(target);

          const active =
            normalized === route;

          element.classList.toggle(
            "active",
            active
          );

          element.setAttribute(
            "aria-current",
            active ? "page" : "false"
          );
        });
    },

    // =======================================================
    // 404 page
    // =======================================================
    showNotFound: function () {
      const container =
        document.querySelector(
          "[data-router-view]"
        ) ||
        document.querySelector(
          "main"
        );

      if (!container) {
        return;
      }

      container.innerHTML = `
        <section class="empty-state route-not-found">
          <div class="empty-state-icon">🔎</div>
          <h2>Page not found</h2>
          <p>The page you are looking for does not exist.</p>
          <button
            type="button"
            class="btn primary"
            data-route="#home"
          >
            Back to Home
          </button>
        </section>
      `;
    },

    // =======================================================
    // Route error
    // =======================================================
    showRouteError: function () {
      const container =
        document.querySelector(
          "[data-router-view]"
        ) ||
        document.querySelector(
          "main"
        );

      if (!container) {
        return;
      }

      container.innerHTML = `
        <section class="empty-state route-error">
          <div class="empty-state-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>We could not load this page.</p>
          <button
            type="button"
            class="btn primary"
            data-route="#home"
          >
            Back to Home
          </button>
        </section>
      `;
    },

    // =======================================================
    // Start router
    // =======================================================
    start: function () {
      if (this.started) {
        return;
      }

      this.started = true;

      // Hash changes
      window.addEventListener(
        "hashchange",
        () => {
          this.handle();
        }
      );

      // Browser back/forward
      window.addEventListener(
        "popstate",
        () => {
          this.handle();
        }
      );

      // Navigation links
      document.addEventListener(
        "click",
        (event) => {
          const link =
            event.target.closest(
              "[data-route], [data-nav], a[href^='#']"
            );

          if (!link) {
            return;
          }

          const route =
            link.getAttribute("data-route") ||
            link.getAttribute("data-nav") ||
            link.getAttribute("href");

          if (!route || route === "#") {
            return;
          }

          // Allow modifier-clicks to work normally
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
        }
      );

      // Initial route
      this.handle();
    }
  };

  // =========================================================
  // Default routes
  // =========================================================

  Router.register("#home", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "home"
        }
      })
    );
  });

  Router.register("#songs", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "songs"
        }
      })
    );
  });

  Router.register("#lyrics", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "lyrics"
        }
      })
    );
  });

  Router.register("#artists", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "artists"
        }
      })
    );
  });

  Router.register("#teachings", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "teachings"
        }
      })
    );
  });

  Router.register("#sermons", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "sermons"
        }
      })
    );
  });

  Router.register("#bible", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "bible"
        }
      })
    );
  });

  Router.register("#bible-study", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "bible-study"
        }
      })
    );
  });

  Router.register("#courses", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "courses"
        }
      })
    );
  });

  Router.register("#videos", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "videos"
        }
      })
    );
  });

  Router.register("#live", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "live"
        }
      })
    );
  });

  Router.register("#community", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "community"
        }
      })
    );
  });

  Router.register("#events", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "events"
        }
      })
    );
  });

  Router.register("#playlists", function () {
    window.dispatchEvent(
      new CustomEvent("pageLoad", {
        detail: {
          page: "playlists"
        }
      })
    );
  });

  // =========================================================
  // Public global object
  // =========================================================

  window.ApostolicRouter = Router;

  // Compatibility alias
  window.Router = Router;

})(window);
