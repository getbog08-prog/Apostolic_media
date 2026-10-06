/* =========================================================
   Apostolic Media
   Language System
   File: js/languages.js
   ========================================================= */

(function (window) {
  "use strict";

  const LANGUAGES = {

    // =======================================================
    // Supported languages
    // =======================================================
    supported: [
      {
        code: "am",
        name: "አማርኛ",
        nativeName: "አማርኛ",
        direction: "ltr"
      },
      {
        code: "en",
        name: "English",
        nativeName: "English",
        direction: "ltr"
      },
      {
        code: "om",
        name: "Afaan Oromoo",
        nativeName: "Afaan Oromoo",
        direction: "ltr"
      }
    ],

    // =======================================================
    // Current language
    // =======================================================
    current: "am",

    // =======================================================
    // Translation strings
    // =======================================================
    translations: {

      // -----------------------------------------------------
      // Amharic
      // -----------------------------------------------------
      am: {
        appName: "የኢየሱስ ልጆች Apostolic Media",
        home: "መነሻ",
        songs: "መዝሙሮች",
        lyrics: "ግጥሞች",
        artists: "ዘማሪዎች እና አገልጋዮች",
        teachings: "ትምህርቶች",
        sermons: "ስብከቶች",
        bible: "መጽሐፍ ቅዱስ",
        bibleStudy: "የመጽሐፍ ቅዱስ ጥናት",
        courses: "ኮርሶች",
        videos: "ቪዲዮዎች",
        live: "ቀጥታ",
        community: "ማህበረሰብ",
        events: "ዝግጅቶች",
        playlists: "የመዝሙር ዝርዝሮች",
        search: "ፈልግ",
        profile: "መገለጫ",
        settings: "ቅንብሮች",
        login: "ግባ",
        register: "ተመዝገብ",
        logout: "ውጣ",
        save: "አስቀምጥ",
        saved: "ተቀምጧል",
        share: "አጋራ",
        download: "አውርድ",
        play: "አጫውት",
        pause: "አቁም",
        next: "ቀጣይ",
        previous: "ቀዳሚ",
        settingsTitle: "ቅንብሮች",
        language: "ቋንቋ",
        theme: "ገጽታ",
        light: "ብርሃን",
        dark: "ጨለማ",
        system: "የስርዓት",
        featured: "ተመራጭ",
        recent: "የቅርብ ጊዜ",
        latestSongs: "አዳዲስ መዝሙሮች",
        christianTeachings: "የክርስቲያን ትምህርቶች",
        latestSermons: "አዳዲስ ስብከቶች",
        latestVideos: "አዳዲስ ቪዲዮዎች",
        upcomingEvents: "መጪ ዝግጅቶች",
        noResults: "ምንም ውጤት አልተገኘም።",
        loading: "በመጫን ላይ...",
        error: "ስህተት ተከስቷል።",
        back: "ተመለስ",
        close: "ዝጋ",
        menu: "ምናሌ",
        welcome: "እንኳን ደህና መጣህ",
        communityTagline:
          "የትም ቦታ ብትሆን ከአንድ የሐዋርያዊ ክርስቲያን ማህበረሰብ ጋር ተቀላቀል።"
      },

      // -----------------------------------------------------
      // English
      // -----------------------------------------------------
      en: {
        appName: "የኢየሱስ ልጆች Apostolic Media",
        home: "Home",
        songs: "Songs",
        lyrics: "Lyrics",
        artists: "Artists & Ministers",
        teachings: "Teachings",
        sermons: "Sermons",
        bible: "Bible",
        bibleStudy: "Bible Study",
        courses: "Courses",
        videos: "Videos",
        live: "Live",
        community: "Community",
        events: "Events",
        playlists: "Playlists",
        search: "Search",
        profile: "Profile",
        settings: "Settings",
        login: "Login",
        register: "Register",
        logout: "Logout",
        save: "Save",
        saved: "Saved",
        share: "Share",
        download: "Download",
        play: "Play",
        pause: "Pause",
        next: "Next",
        previous: "Previous",
        settingsTitle: "Settings",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
        featured: "Featured",
        recent: "Recently Added",
        latestSongs: "Latest Songs",
        christianTeachings: "Christian Teachings",
        latestSermons: "Latest Sermons",
        latestVideos: "Latest Videos",
        upcomingEvents: "Upcoming Events",
        noResults: "No results found.",
        loading: "Loading...",
        error: "Something went wrong.",
        back: "Back",
        close: "Close",
        menu: "Menu",
        welcome: "Welcome",
        communityTagline:
          "Wherever you are, join the same Apostolic Christian community."
      },

      // -----------------------------------------------------
      // Afaan Oromoo
      // -----------------------------------------------------
      om: {
        appName: "የኢየሱስ ልጆች Apostolic Media",
        home: "Mana",
        songs: "Faarfannaa",
        lyrics: "Jecha Faarfannaa",
        artists: "Faarfattootaa fi Tajaajiltoota",
        teachings: "Barnoota",
        sermons: "Lallaba",
        bible: "Macaafa Qulqulluu",
        bibleStudy: "Qorannoo Macaafa Qulqulluu",
        courses: "Koorsiiwwan",
        videos: "Viidiyoo",
        live: "Kallattiin",
        community: "Hawaasa",
        events: "Sagantaawwan",
        playlists: "Tarree Faarfannaa",
        search: "Barbaadi",
        profile: "Profaayilii",
        settings: "Qindaa'ina",
        login: "Seeni",
        register: "Galmaa'i",
        logout: "Ba'i",
        save: "Olkaa'i",
        saved: "Olkaa'ameera",
        share: "Qoodi",
        download: "Buusi",
        play: "Taphachiisi",
        pause: "Dhaabi",
        next: "Itti aanu",
        previous: "Kan duraa",
        settingsTitle: "Qindaa'ina",
        language: "Afaan",
        theme: "Bifa",
        light: "Ifa",
        dark: "Dukkana",
        system: "Sirna",
        featured: "Kan Filatame",
        recent: "Dhiheenya Kan Dabalame",
        latestSongs: "Faarfannaa Haaraa",
        christianTeachings: "Barnoota Kiristaanaa",
        latestSermons: "Lallaba Haaraa",
        latestVideos: "Viidiyoo Haaraa",
        upcomingEvents: "Sagantaawwan Dhufan",
        noResults: "Bu'aan hin argamne.",
        loading: "Fe'amaa jira...",
        error: "Dogoggorri uumameera.",
        back: "Duubatti",
        close: "Cufi",
        menu: "Baafata",
        welcome: "Baga Nagaan Dhuftan",
        communityTagline:
          "Bakka jirtu hundatti hawaasa Kiristaanaa Apostolic tokko waliin walitti dhufaa."
      }
    },

    // =======================================================
    // Get language information
    // =======================================================
    getLanguage: function (code) {
      return this.supported.find(function (language) {
        return language.code === code;
      }) || this.supported[0];
    },

    // =======================================================
    // Set current language
    // =======================================================
    setLanguage: function (code) {
      if (!this.translations[code]) {
        return false;
      }

      this.current = code;

      try {
        localStorage.setItem("apostolic_language", code);
      } catch (error) {
        console.warn("Unable to save language:", error);
      }

      this.applyLanguage();

      return true;
    },

    // =======================================================
    // Load saved language
    // =======================================================
    loadLanguage: function () {
      let savedLanguage = null;

      try {
        savedLanguage = localStorage.getItem("apostolic_language");
      } catch (error) {
        savedLanguage = null;
      }

      if (savedLanguage && this.translations[savedLanguage]) {
        this.current = savedLanguage;
      }

      return this.current;
    },

    // =======================================================
    // Translate
    // =======================================================
    t: function (key, fallback) {
      const translation =
        this.translations[this.current] &&
        this.translations[this.current][key];

      if (translation) {
        return translation;
      }

      if (this.translations.en[key]) {
        return this.translations.en[key];
      }

      return fallback || key;
    },

    // =======================================================
    // Apply translations to HTML
    // =======================================================
    applyLanguage: function () {
      const self = this;

      document.documentElement.lang = this.current;

      const language = this.getLanguage(this.current);

      document.documentElement.dir =
        language.direction || "ltr";

      document
        .querySelectorAll("[data-i18n]")
        .forEach(function (element) {
          const key = element.getAttribute("data-i18n");

          element.textContent = self.t(key);
        });

      document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(function (element) {
          const key = element.getAttribute(
            "data-i18n-placeholder"
          );

          element.placeholder = self.t(key);
        });

      document
        .querySelectorAll("[data-i18n-title]")
        .forEach(function (element) {
          const key = element.getAttribute("data-i18n-title");

          element.title = self.t(key);
        });

      document
        .querySelectorAll("[data-i18n-aria-label]")
        .forEach(function (element) {
          const key = element.getAttribute(
            "data-i18n-aria-label"
          );

          element.setAttribute(
            "aria-label",
            self.t(key)
          );
        });

      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: {
            language: this.current
          }
        })
      );
    },

    // =======================================================
    // Initialize language system
    // =======================================================
    init: function () {
      this.loadLanguage();
      this.applyLanguage();

      return this.current;
    }
  };

  // =========================================================
  // Public global object
  // =========================================================

  window.ApostolicLanguages = LANGUAGES;

  // Compatibility alias
  window.Languages = LANGUAGES;

})(window);
