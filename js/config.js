/* =========================================================
   Apostolic Media
   Configuration
   File: js/config.js
   ========================================================= */

(function (window) {
  "use strict";

  const CONFIG = {
    // -------------------------------------------------------
    // Application
    // -------------------------------------------------------
    APP_NAME: "የኢየሱስ ልጆች Apostolic Media",
    APP_SHORT_NAME: "Apostolic Media",
    APP_VERSION: "1.3.0",

    TAGLINE:
      "Wherever you are, join the same Apostolic Christian community.",

    // -------------------------------------------------------
    // Default settings
    // -------------------------------------------------------
    DEFAULT_LANGUAGE: "am",
    DEFAULT_THEME: "system",

    SUPPORTED_LANGUAGES: [
      "am",
      "en",
      "om"
    ],

    SUPPORTED_THEMES: [
      "light",
      "dark",
      "system"
    ],

    // -------------------------------------------------------
    // Storage keys
    // -------------------------------------------------------
    STORAGE_KEYS: {
      LANGUAGE: "apostolic_language",
      THEME: "apostolic_theme",
      USER: "apostolic_user",
      SESSION: "apostolic_session",
      SETTINGS: "apostolic_settings",
      PLAYLISTS: "apostolic_playlists",
      FAVORITES: "apostolic_favorites",
      RECENT: "apostolic_recent",
      DOWNLOADS: "apostolic_downloads",
      DATA_SAVER: "apostolic_data_saver"
    },

    // -------------------------------------------------------
    // Routes
    // -------------------------------------------------------
    ROUTES: {
      HOME: "#home",
      SONGS: "#songs",
      LYRICS: "#lyrics",
      ARTISTS: "#artists",
      TEACHINGS: "#teachings",
      SERMONS: "#sermons",
      BIBLE: "#bible",
      BIBLE_STUDY: "#bible-study",
      COURSES: "#courses",
      VIDEOS: "#videos",
      LIVE: "#live",
      COMMUNITY: "#community",
      EVENTS: "#events",
      PLAYLISTS: "#playlists",
      SEARCH: "#search",
      PROFILE: "#profile",
      SETTINGS: "#settings",
      LOGIN: "#login",
      REGISTER: "#register",
      ADMIN: "#admin",
      CREATOR: "#creator"
    },

    // -------------------------------------------------------
    // Pagination
    // -------------------------------------------------------
    PAGINATION: {
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 100
    },

    // -------------------------------------------------------
    // Media settings
    // -------------------------------------------------------
    MEDIA: {
      DEFAULT_VOLUME: 0.8,
      AUTOPLAY: false,
      PRELOAD: "metadata"
    },

    // -------------------------------------------------------
    // Search
    // -------------------------------------------------------
    SEARCH: {
      MIN_LENGTH: 2,
      MAX_RESULTS: 50,
      DEBOUNCE_TIME: 300
    },

    // -------------------------------------------------------
    // Notifications
    // -------------------------------------------------------
    NOTIFICATIONS: {
      ENABLED: true,
      DEFAULT_DURATION: 4000
    },

    // -------------------------------------------------------
    // Feature flags
    // -------------------------------------------------------
    FEATURES: {
      AUTH: true,
      SONGS: true,
      LYRICS: true,
      TEACHINGS: true,
      SERMONS: true,
      BIBLE: true,
      BIBLE_STUDY: true,
      COURSES: true,
      VIDEOS: true,
      LIVE: true,
      COMMUNITY: true,
      EVENTS: true,
      PLAYLISTS: true,
      SEARCH: true,
      DOWNLOADS: true,
      CREATOR_DASHBOARD: true,
      ADMIN_DASHBOARD: true,
      WALLET: true,
      RECOMMENDATIONS: true
    },

    // -------------------------------------------------------
    // Supabase
    // -------------------------------------------------------
    // Browser-safe publishable key. Do NOT put a secret/service
    // role key in this file.
    SUPABASE: {
      URL: "https://fzhtzvvpnrwxqoherdrg.supabase.co",
      ANON_KEY: "sb_publishable_RXuHDQ6eQfQp0I_-eZgR_Q_DQbuXDDZ"
    },

    // -------------------------------------------------------
    // Upload settings
    // -------------------------------------------------------
    UPLOADS: {
      BUCKET: "Apostolic_Media"
    },

    // -------------------------------------------------------
    // External services
    // -------------------------------------------------------
    SERVICES: {
      API_BASE_URL: "",
      STORAGE_BASE_URL: "",
      LIVE_SERVER_URL: "",
      CDN_URL: ""
    },

    // -------------------------------------------------------
    // Payment providers
    // -------------------------------------------------------
    PAYMENTS: {
      CBE: {
        ENABLED: false,
        API_URL: ""
      },

      TELEBIRR: {
        ENABLED: false,
        API_URL: ""
      }
    },

    // -------------------------------------------------------
    // Development
    // -------------------------------------------------------
    ENVIRONMENT: "development",

    DEBUG: true
  };

  CONFIG.isProduction = function () {
    return CONFIG.ENVIRONMENT === "production";
  };

  CONFIG.isDevelopment = function () {
    return CONFIG.ENVIRONMENT === "development";
  };

  CONFIG.getLanguage = function () {
    try {
      return (
        localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) ||
        CONFIG.DEFAULT_LANGUAGE
      );
    } catch (error) {
      return CONFIG.DEFAULT_LANGUAGE;
    }
  };

  CONFIG.getTheme = function () {
    try {
      return (
        localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) ||
        CONFIG.DEFAULT_THEME
      );
    } catch (error) {
      return CONFIG.DEFAULT_THEME;
    }
  };

  CONFIG.setLanguage = function (language) {
    if (!CONFIG.SUPPORTED_LANGUAGES.includes(language)) {
      return false;
    }

    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.LANGUAGE,
        language
      );
    } catch (error) {
      console.warn("Unable to save language:", error);
    }

    return true;
  };

  CONFIG.setTheme = function (theme) {
    if (!CONFIG.SUPPORTED_THEMES.includes(theme)) {
      return false;
    }

    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEYS.THEME,
        theme
      );
    } catch (error) {
      console.warn("Unable to save theme:", error);
    }

    return true;
  };

  Object.freeze(CONFIG.ROUTES);
  Object.freeze(CONFIG.STORAGE_KEYS);
  Object.freeze(CONFIG.FEATURES);
  Object.freeze(CONFIG.SUPPORTED_LANGUAGES);
  Object.freeze(CONFIG.SUPPORTED_THEMES);
  Object.freeze(CONFIG.PAGINATION);
  Object.freeze(CONFIG.MEDIA);
  Object.freeze(CONFIG.SEARCH);
  Object.freeze(CONFIG.NOTIFICATIONS);

  window.ApostolicConfig = CONFIG;
  window.APP_CONFIG = CONFIG;

  if (CONFIG.DEBUG) {
    console.log(
      `${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} configuration loaded.`
    );
  }

})(window);
