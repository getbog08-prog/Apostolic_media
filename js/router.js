/* =========================================================
   Apostolic Media
   Application Router
   File: js/router.js
   ========================================================= */

(function (window) {
  "use strict";

  const Router = {

    routes: {},
    currentRoute: null,
    started: false,

    register(path, handler) {
      const route = this.normalize(path);
      this.routes[route] = handler;
      return this;
    },

    registerMany(routes) {
      Object.keys(routes).forEach(path => {
        this.register(path, routes[path]);
      });

      return this;
    },

    getHash() {
      return window.location.hash || "#home";
    },

    normalize(route) {

      if (!route) {
        return "#home";
      }

      let value = String(route).trim();

      if (!value.startsWith("#")) {
        value = "#" + value;
      }

      value = value.replace(/^#+/, "#");

      return value.toLowerCase();
    },

    getParams(route) {

      const normalized = this.normalize(route);

      const clean = normalized
        .replace(/^#/, "")
        .split("?")[0];

      const queryString =
        normalized.includes("?")
          ? normalized.split("?")[1]
          : "";

      const params = {};

      if (queryString) {
        const searchParams =
          new URLSearchParams(queryString);

        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      }

      return {
        name: clean || "home",
        params
      };
    },

    navigate(route, replace = false) {

      const normalized = this.normalize(route);

      if (replace) {
        window.history.replaceState(
          {},
          "",
          normalized
        );

        this.handle();
        return;
      }

      if (window.location.hash === normalized) {
        this.handle();
        return;
      }

      window.location.hash =
        normalized.substring(1);
    },

    back() {
      window.history.back();
    },

    handle() {

      const route =
        this.normalize(this.getHash());

      const routeInfo =
        this.getParams(route);

      this.currentRoute = route;

      const handler =
        this.routes[route] ||
        this.routes["#*"];

      if (typeof handler === "function") {

        try {

          handler(routeInfo);

        } catch (error) {

          console.error(
            "Route error:",
            error
          );

          this.showRouteError(
            error
          );
        }

      } else {

        this.showNotFound(
          routeInfo.name
        );
      }

      this.updateActiveNavigation(
        route
      );

      window.dispatchEvent(
        new CustomEvent(
          "routeChanged",
          {
            detail: {
              route: route,
              name: routeInfo.name,
              params: routeInfo.params
            }
          }
        )
      );
    },

    updateActiveNavigation(route) {

      document
        .querySelectorAll(
          "[data-route], [data-nav], a[href^='#']"
        )
        .forEach(element => {

          const target =
            element.getAttribute("data-route") ||
            element.getAttribute("data-nav") ||
            element.getAttribute("href");

          if (!target) {
            return;
          }

          const normalized =
            this.normalize(target);

          const active =
            normalized === route;

          element.classList.toggle(
            "active",
            active
          );

          if (active) {
            element.setAttribute(
              "aria-current",
              "page"
            );
          } else {
            element.removeAttribute(
              "aria-current"
            );
          }
        });
    },

    showNotFound(routeName) {

      const main =
        document.getElementById(
          "mainContent"
        );

      if (!main) {
        return;
      }

      main.innerHTML = `
        <section class="page-shell page-not-found">

          <div class="page-header">
            <span class="eyebrow">404</span>

            <h1>Page Not Found</h1>

            <p>
              The page
              <strong>#${this.escape(routeName || "")}</strong>
              is not available yet.
            </p>
          </div>

          <div class="page-card">

            <div class="page-card-icon">🕎</div>

            <h2>Apostolic Media</h2>

            <p>
              This section is being prepared.
              Please return to the home page.
            </p>

            <button
              class="btn primary"
              data-route="#home"
            >
              ← Back to Home
            </button>

          </div>

        </section>
      `;
    },

    showRouteError(error) {

      const main =
        document.getElementById(
          "mainContent"
        );

      if (!main) {
        return;
      }

      main.innerHTML = `
        <section class="page-shell">

          <div class="page-header">
            <span class="eyebrow">ERROR</span>

            <h1>Something went wrong</h1>

            <p>
              This page could not be loaded.
            </p>
          </div>

          <div class="page-card">

            <p>
              Please try again.
            </p>

            <button
              class="btn primary"
              data-route="#home"
            >
              ← Back to Home
            </button>

          </div>

        </section>
      `;

      console.error(error);
    },

    escape(value) {

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    start() {

      if (this.started) {
        return;
      }

      this.started = true;

      window.addEventListener(
        "hashchange",
        () => this.handle()
      );

      window.addEventListener(
        "popstate",
        () => this.handle()
      );

      document.addEventListener(
        "click",
        event => {

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

      this.handle();
    }
  };


  /* =========================================================
     ROUTE REGISTRATION
     ========================================================= */

  const pages = [
    "home",
    "bible",
    "teachings",
    "sermons",
    "songs",
    "videos",
    "lyrics",
    "live",
    "community",
    "qa",
    "events",
    "downloads",
    "saved",
    "playlists",
    "creator",
    "wallet",
    "admin",
    "settings",
    "about",
    "profile",
    "notifications",
    "bible-study",
    "courses",
    "artists"
  ];


  pages.forEach(page => {

    Router.register(
      "#" + page,
      function (routeInfo) {

        window.dispatchEvent(
          new CustomEvent(
            "pageLoad",
            {
              detail: {
                page: page,
                params: routeInfo.params
              }
            }
          )
        );

      }
    );

  });


  /* =========================================================
     FALLBACK
     ========================================================= */

  Router.register(
    "#*",
    function (routeInfo) {

      Router.showNotFound(
        routeInfo.name
      );

    }
  );


  /* =========================================================
     GLOBAL EXPORT
     ========================================================= */

  window.ApostolicRouter = Router;
  window.Router = Router;

})(window);
