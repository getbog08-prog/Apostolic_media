/* =========================================================
   Apostolic Media
   Authentication Module
   Supabase Auth Ready
   ========================================================= */

(function () {
  "use strict";

  const AUTH_KEY = "apostolic_auth_user";

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

  const auth = {
    user: null,
    session: null,

    /* -----------------------------------------------------
       Initialize
       ----------------------------------------------------- */

    async init() {
      const savedUser = storage.get(AUTH_KEY);

      if (savedUser) {
        this.user = savedUser;
      }

      /*
       * If Supabase is configured, use Supabase Auth.
       */
      if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.getSession ===
          "function"
      ) {
        try {
          const {
            data,
            error
          } =
            await window.supabaseClient.auth.getSession();

          if (!error && data?.session) {
            this.session = data.session;
            this.user = data.session.user;

            storage.set(
              AUTH_KEY,
              this.user
            );
          }
        } catch (error) {
          console.warn(
            "Supabase session check failed:",
            error
          );
        }
      }

      this.updateUI();

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:authready",
          {
            detail: {
              user: this.user,
              session: this.session
            }
          }
        )
      );

      return this.user;
    },

    /* -----------------------------------------------------
       Sign Up
       ----------------------------------------------------- */

    async signUp(
      email,
      password,
      metadata = {}
    ) {
      if (!email || !password) {
        throw new Error(
          "Email and password are required."
        );
      }

      if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.signUp ===
          "function"
      ) {
        const {
          data,
          error
        } =
          await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: metadata
            }
          });

        if (error) {
          throw error;
        }

        if (data?.user) {
          this.user = data.user;
          this.session = data.session || null;

          storage.set(
            AUTH_KEY,
            this.user
          );

          this.updateUI();
        }

        return data;
      }

      /*
       * Temporary local development fallback.
       * Replace with Supabase Auth in production.
       */
      const user = {
        id:
          "local-" +
          Date.now(),
        email,
        user_metadata: metadata,
        role: "User"
      };

      this.user = user;
      this.session = null;

      storage.set(
        AUTH_KEY,
        user
      );

      this.updateUI();

      return {
        user,
        session: null
      };
    },

    /* -----------------------------------------------------
       Sign In
       ----------------------------------------------------- */

    async signIn(
      email,
      password
    ) {
      if (!email || !password) {
        throw new Error(
          "Email and password are required."
        );
      }

      if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.signInWithPassword ===
          "function"
      ) {
        const {
          data,
          error
        } =
          await window.supabaseClient.auth.signInWithPassword(
            {
              email,
              password
            }
          );

        if (error) {
          throw error;
        }

        this.user = data.user;
        this.session = data.session;

        storage.set(
          AUTH_KEY,
          this.user
        );

        this.updateUI();

        return data;
      }

      /*
       * Local development fallback.
       */
      const user = {
        id:
          "local-" +
          Date.now(),
        email,
        role: "User"
      };

      this.user = user;
      this.session = null;

      storage.set(
        AUTH_KEY,
        user
      );

      this.updateUI();

      return {
        user,
        session: null
      };
    },

    /* -----------------------------------------------------
       Sign Out
       ----------------------------------------------------- */

    async signOut() {
      if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.signOut ===
          "function"
      ) {
        const {
          error
        } =
          await window.supabaseClient.auth.signOut();

        if (error) {
          throw error;
        }
      }

      this.user = null;
      this.session = null;

      storage.remove(
        AUTH_KEY
      );

      this.updateUI();

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:signout"
        )
      );

      return true;
    },

    /* -----------------------------------------------------
       Password Reset
       ----------------------------------------------------- */

    async resetPassword(email) {
      if (!email) {
        throw new Error(
          "Email is required."
        );
      }

      if (
        window.supabaseClient &&
        typeof window.supabaseClient.auth?.resetPasswordForEmail ===
          "function"
      ) {
        const {
          data,
          error
        } =
          await window.supabaseClient.auth
            .resetPasswordForEmail(
              email
            );

        if (error) {
          throw error;
        }

        return data;
      }

      return {
        success: true,
        message:
          "Password reset is available after Supabase is configured."
      };
    },

    /* -----------------------------------------------------
       Current User
       ----------------------------------------------------- */

    getUser() {
      return this.user;
    },

    /* -----------------------------------------------------
       Current Session
       ----------------------------------------------------- */

    getSession() {
      return this.session;
    },

    /* -----------------------------------------------------
       Login Status
       ----------------------------------------------------- */

    isLoggedIn() {
      return !!this.user;
    },

    /* -----------------------------------------------------
       User Role
       ----------------------------------------------------- */

    getRole() {
      if (!this.user) {
        return "Guest";
      }

      return (
        this.user.user_metadata?.role ||
        this.user.role ||
        "User"
      );
    },

    /* -----------------------------------------------------
       Role Checking
       ----------------------------------------------------- */

    hasRole(role) {
      return (
        this.getRole().toLowerCase() ===
        String(role).toLowerCase()
      );
    },

    hasAnyRole(roles = []) {
      const currentRole =
        this.getRole().toLowerCase();

      return roles.some(
        (role) =>
          currentRole ===
          String(role).toLowerCase()
      );
    },

    /* -----------------------------------------------------
       Protected Route Helper
       ----------------------------------------------------- */

    requireAuth(callback) {
      if (this.isLoggedIn()) {
        if (typeof callback === "function") {
          callback(this.user);
        }

        return true;
      }

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:loginrequired"
        )
      );

      return false;
    },

    /* -----------------------------------------------------
       UI Updates
       ----------------------------------------------------- */

    updateUI() {
      const loggedIn =
        this.isLoggedIn();

      document.body.classList.toggle(
        "authenticated",
        loggedIn
      );

      document.body.classList.toggle(
        "guest",
        !loggedIn
      );

      $$("[data-auth-user]").forEach(
        (element) => {
          const value =
            element.dataset.authUser;

          if (!loggedIn) {
            element.textContent =
              "Guest";
            return;
          }

          if (
            value === "email"
          ) {
            element.textContent =
              this.user.email || "";
          } else if (
            value === "name"
          ) {
            element.textContent =
              this.getName();
          } else if (
            value === "role"
          ) {
            element.textContent =
              this.getRole();
          }
        }
      );

      $$("[data-auth-only]").forEach(
        (element) => {
          element.hidden =
            !loggedIn;
        }
      );

      $$("[data-guest-only]").forEach(
        (element) => {
          element.hidden =
            loggedIn;
        }
      );
    },

    /* -----------------------------------------------------
       User Name
       ----------------------------------------------------- */

    getName() {
      if (!this.user) {
        return "Guest";
      }

      return (
        this.user.user_metadata?.full_name ||
        this.user.user_metadata?.name ||
        this.user.email?.split("@")[0] ||
        "User"
      );
    },

    /* -----------------------------------------------------
       Avatar Initial
       ----------------------------------------------------- */

    getInitial() {
      const name =
        this.getName();

      return name
        ? name.charAt(0).toUpperCase()
        : "U";
    }
  };

  /* -------------------------------------------------------
     DOM Helper
     ------------------------------------------------------- */

  function $$(selector) {
    return Array.from(
      document.querySelectorAll(
        selector
      )
    );
  }

  /* -------------------------------------------------------
     Auth Forms
     ------------------------------------------------------- */

  function initForms() {
    const loginForms =
      $$("[data-login-form]");

    loginForms.forEach(
      (form) => {
        form.addEventListener(
          "submit",
          async (event) => {
            event.preventDefault();

            const email =
              form.querySelector(
                '[name="email"]'
              )?.value.trim();

            const password =
              form.querySelector(
                '[name="password"]'
              )?.value;

            try {
              await auth.signIn(
                email,
                password
              );

              window.dispatchEvent(
                new CustomEvent(
                  "apostolic:login",
                  {
                    detail: {
                      user: auth.user
                    }
                  }
                )
              );
            } catch (error) {
              console.error(
                "Login failed:",
                error
              );
            }
          }
        );
      }
    );

    const signupForms =
      $$("[data-signup-form]");

    signupForms.forEach(
      (form) => {
        form.addEventListener(
          "submit",
          async (event) => {
            event.preventDefault();

            const email =
              form.querySelector(
                '[name="email"]'
              )?.value.trim();

            const password =
              form.querySelector(
                '[name="password"]'
              )?.value;

            const name =
              form.querySelector(
                '[name="name"]'
              )?.value.trim();

            try {
              await auth.signUp(
                email,
                password,
                {
                  full_name: name,
                  role: "User"
                }
              );

              window.dispatchEvent(
                new CustomEvent(
                  "apostolic:signup",
                  {
                    detail: {
                      user: auth.user
                    }
                  }
                )
              );
            } catch (error) {
              console.error(
                "Sign up failed:",
                error
              );
            }
          }
        );
      }
    );

    $$("[data-logout]").forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            try {
              await auth.signOut();
            } catch (error) {
              console.error(
                "Logout failed:",
                error
              );
            }
          }
        );
      }
    );
  }

  /* -------------------------------------------------------
     Public API
     ------------------------------------------------------- */

  window.ApostolicAuth =
    auth;

  /* -------------------------------------------------------
     Initialize
     ------------------------------------------------------- */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      async () => {
        await auth.init();
        initForms();
      }
    );
  } else {
    auth.init().then(
      initForms
    );
  }

})();
