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
        const value =
          localStorage.getItem(key);

        return value === null
          ? fallback
          : JSON.parse(value);

      } catch {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify(value)
        );
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

        sidebar.classList.toggle(
          "open"
        );

        menuButton.classList.toggle(
          "active"
        );

        const isOpen =
          sidebar.classList.contains(
            "open"
          );

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

            if (
              window.innerWidth < 1024
            ) {

              sidebar.classList.remove(
                "open"
              );

              menuButton.classList.remove(
                "active"
              );
            }
          }
        );
      }
    );
  }


  /* -------------------------------------------------------
     Navigation
     ------------------------------------------------------- */

  function initNavigation() {
    /*
      Navigation is controlled by router.js.
    */
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

          if (
            event.key !== "Enter"
          ) {
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

        if (
          event.key !== "Escape"
        ) {
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


  /* =======================================================
     PAGE SYSTEM
     ======================================================= */

  function pageTemplate(options) {

    return `
      <section class="page-shell">

        <div class="page-header">

          <div class="page-header-icon">
            ${options.icon || "🕎"}
          </div>

          <div>
            <span class="eyebrow">
              ${options.eyebrow || "APOSTOLIC MEDIA"}
            </span>

            <h1>
              ${options.title}
            </h1>

            <p>
              ${options.subtitle || ""}
            </p>
          </div>

        </div>

        ${options.content || ""}

      </section>
    `;
  }


  /* -------------------------------------------------------
     Home
     ------------------------------------------------------- */

  function renderHome() {

    return pageTemplate({

      icon: "🕎",

      eyebrow:
        "የኢየሱስ ልጆች",

      title:
        "Apostolic Media",

      subtitle:
        "Wherever you are, join the same Apostolic Christian community.",

      content: `

        <div class="hero">

          <div class="hero-content">

            <h2>
              Welcome to Apostolic Media
            </h2>

            <p>
              Bible, worship, teachings,
              sermons, Christian learning
              and community.
            </p>

            <div class="hero-actions">

              <a
                href="#bible"
                class="btn primary"
              >
                📖 Open Bible
              </a>

              <a
                href="#teachings"
                class="btn secondary"
              >
                📚 Explore Teachings
              </a>

            </div>

          </div>

        </div>

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              📖
            </span>

            <h3>
              Bible
            </h3>

            <p>
              Read and study God's Word.
            </p>

            <a
              href="#bible"
              class="btn secondary"
            >
              Open Bible →
            </a>

          </article>

          <article class="card">

            <span class="card-icon">
              🎵
            </span>

            <h3>
              Songs
            </h3>

            <p>
              Discover Christian worship songs.
            </p>

            <a
              href="#songs"
              class="btn secondary"
            >
              Explore Songs →
            </a>

          </article>

          <article class="card">

            <span class="card-icon">
              🎙️
            </span>

            <h3>
              Sermons
            </h3>

            <p>
              Listen to Christian messages.
            </p>

            <a
              href="#sermons"
              class="btn secondary"
            >
              View Sermons →
            </a>

          </article>

          <article class="card">

            <span class="card-icon">
              📚
            </span>

            <h3>
              Bible Studies
            </h3>

            <p>
              Grow through Scripture-based studies.
            </p>

            <a
              href="#bible-study"
              class="btn secondary"
            >
              Start Study →
            </a>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Bible
     ------------------------------------------------------- */

  function renderBible() {

    return pageTemplate({

      icon: "📖",

      eyebrow:
        "SCRIPTURE",

      title:
        "Holy Bible",

      subtitle:
        "Read and study God's Word.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              📖
            </span>

            <h3>
              Bible Reading
            </h3>

            <p>
              Explore the Holy Scriptures.
            </p>

            <button class="btn primary">
              Open Bible
            </button>

          </article>

          <article class="card">

            <span class="card-icon">
              🔎
            </span>

            <h3>
              Search Scripture
            </h3>

            <p>
              Search Bible passages and verses.
            </p>

            <button class="btn secondary">
              Search Bible
            </button>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Bible Study
     ------------------------------------------------------- */

  function renderBibleStudy() {

    return pageTemplate({

      icon: "📚",

      eyebrow:
        "STUDY",

      title:
        "Bible Study",

      subtitle:
        "Grow in the Word.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <h3>
              Foundations of Christian Faith
            </h3>

            <p>
              Structured Bible study series.
            </p>

            <button class="btn primary">
              Start Study
            </button>

          </article>

          <article class="card">

            <h3>
              Jesus Christ and the Gospel
            </h3>

            <p>
              Scripture-based teaching.
            </p>

            <button class="btn secondary">
              Read Study
            </button>

          </article>

          <article class="card">

            <h3>
              Living the Christian Life
            </h3>

            <p>
              Practical discipleship.
            </p>

            <button class="btn secondary">
              Continue
            </button>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Teachings
     ------------------------------------------------------- */

  function renderTeachings() {

    return pageTemplate({

      icon: "📘",

      eyebrow:
        "TEACHINGS",

      title:
        "Christian Teachings",

      subtitle:
        "Scripture-based teaching.",

      content: `

        <div class="content-card">

          <h2>
            Apostolic Christian Teachings
          </h2>

          <p>
            Explore teachings, Bible explanations
            and spiritual lessons.
          </p>

          <div class="hero-actions">

            <button class="btn primary">
              Browse Teachings
            </button>

            <button class="btn secondary">
              New Teaching
            </button>

          </div>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Sermons
     ------------------------------------------------------- */

  function renderSermons() {

    return pageTemplate({

      icon: "🎙️",

      eyebrow:
        "SERMONS",

      title:
        "Sermons",

      subtitle:
        "Messages for spiritual growth.",

      content: `

        <div class="content-card">

          <h2>
            Christian Sermons
          </h2>

          <p>
            Sermons and messages from Apostolic
            Christian ministers will appear here.
          </p>

          <button class="btn primary">
            Browse Sermons
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Songs
     ------------------------------------------------------- */

  function renderSongs() {

    return pageTemplate({

      icon: "🎵",

      eyebrow:
        "WORSHIP",

      title:
        "Christian Songs",

      subtitle:
        "Worship and praise.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              🎵
            </span>

            <h3>
              Worship Songs
            </h3>

            <p>
              Christian worship and praise music.
            </p>

            <button class="btn primary">
              Play
            </button>

          </article>

          <article class="card">

            <span class="card-icon">
              📝
            </span>

            <h3>
              Song Lyrics
            </h3>

            <p>
              Read Christian song lyrics.
            </p>

            <a
              href="#lyrics"
              class="btn secondary"
            >
              View Lyrics →
            </a>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Lyrics
     ------------------------------------------------------- */

  function renderLyrics() {

    return pageTemplate({

      icon: "📝",

      eyebrow:
        "LYRICS",

      title:
        "Christian Lyrics",

      subtitle:
        "Worship and praise lyrics.",

      content: `

        <div class="content-card">

          <h2>
            Song Lyrics
          </h2>

          <p>
            Search and read Christian worship lyrics.
          </p>

          <button class="btn primary">
            Search Lyrics
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Videos
     ------------------------------------------------------- */

  function renderVideos() {

    return pageTemplate({

      icon: "▶️",

      eyebrow:
        "MEDIA",

      title:
        "Christian Videos",

      subtitle:
        "Watch and learn.",

      content: `

        <div class="content-card">

          <h2>
            Christian Video Library
          </h2>

          <p>
            Apostolic Christian videos,
            teachings and ministry content.
          </p>

          <button class="btn primary">
            Browse Videos
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Live
     ------------------------------------------------------- */

  function renderLive() {

    return pageTemplate({

      icon: "🔴",

      eyebrow:
        "LIVE",

      title:
        "Live",

      subtitle:
        "Live Christian ministry.",

      content: `

        <div class="content-card">

          <h2>
            Live Ministry
          </h2>

          <p>
            Live Christian broadcasts will appear here.
          </p>

          <button class="btn primary">
            Start Watching
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Community
     ------------------------------------------------------- */

  function renderCommunity() {

    return pageTemplate({

      icon: "👥",

      eyebrow:
        "COMMUNITY",

      title:
        "Community",

      subtitle:
        "Connect with believers.",

      content: `

        <div class="content-card">

          <h2>
            Apostolic Christian Community
          </h2>

          <p>
            Share, communicate and connect
            with fellow believers.
          </p>

          <div class="hero-actions">

            <button class="btn primary">
              Create Post
            </button>

            <button class="btn secondary">
              Ask a Question
            </button>

          </div>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Q&A
     ------------------------------------------------------- */

  function renderQA() {

    return pageTemplate({

      icon: "❓",

      eyebrow:
        "QUESTIONS",

      title:
        "Bible Q&A",

      subtitle:
        "Ask and answer Bible questions.",

      content: `

        <div class="content-card">

          <h2>
            Bible Questions & Answers
          </h2>

          <p>
            Ask questions about Scripture
            and learn from the community.
          </p>

          <div class="hero-actions">

            <button class="btn primary">
              Ask a Question
            </button>

            <button class="btn secondary">
              Browse Questions
            </button>

          </div>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Events
     ------------------------------------------------------- */

  function renderEvents() {

    return pageTemplate({

      icon: "📅",

      eyebrow:
        "EVENTS",

      title:
        "Christian Events",

      subtitle:
        "Upcoming Apostolic Christian events.",

      content: `

        <div class="content-card">

          <h2>
            Upcoming Events
          </h2>

          <p>
            Conferences, worship programs,
            Bible studies and Christian events.
          </p>

          <button class="btn primary">
            Create Event
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Downloads
     ------------------------------------------------------- */

  function renderDownloads() {

    return pageTemplate({

      icon: "📥",

      eyebrow:
        "LIBRARY",

      title:
        "Downloads",

      subtitle:
        "Your downloaded Christian materials.",

      content: `

        <div class="content-card">

          <h2>
            Downloaded Materials
          </h2>

          <p>
            Your saved offline Bible studies,
            teachings, songs and other resources
            will appear here.
          </p>

          <button class="btn secondary">
            Refresh Downloads
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Saved
     ------------------------------------------------------- */

  function renderSaved() {

    return pageTemplate({

      icon: "♡",

      eyebrow:
        "LIBRARY",

      title:
        "Saved",

      subtitle:
        "Your saved content.",

      content: `

        <div class="content-card">

          <h2>
            Saved Content
          </h2>

          <p>
            Songs, teachings, sermons,
            Bible studies and other content
            you save will appear here.
          </p>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Playlists
     ------------------------------------------------------- */

  function renderPlaylists() {

    return pageTemplate({

      icon: "☷",

      eyebrow:
        "LIBRARY",

      title:
        "Playlists",

      subtitle:
        "Organize your favorite media.",

      content: `

        <div class="content-card">

          <h2>
            My Playlists
          </h2>

          <p>
            Create and manage your Christian
            media playlists.
          </p>

          <button class="btn primary">
            + Create Playlist
          </button>

        </div>
      `
    });
  }


  /* =======================================================
     CREATOR STUDIO
     ======================================================= */

  function renderCreator() {

    return pageTemplate({

      icon: "◈",

      eyebrow:
        "CREATOR",

      title:
        "Creator Studio",

      subtitle:
        "Create, upload and manage your Christian content.",

      content: `

        <div class="cards-grid">

          <!-- CREATE -->

          <article class="card">

            <span class="card-icon">
              ➕
            </span>

            <h3>
              Create
            </h3>

            <p>
              Create a new song, teaching,
              sermon, Bible study, article,
              video or other Christian content.
            </p>

            <button
              class="btn primary"
              data-action="creator-create"
            >
              + Create
            </button>

          </article>


          <!-- UPLOAD -->

          <article class="card">

            <span class="card-icon">
              ⬆️
            </span>

            <h3>
              Upload
            </h3>

            <p>
              Upload your Christian audio,
              video, PDF, document or image.
            </p>

            <button
              class="btn primary"
              data-action="creator-upload"
            >
              ⬆ Upload
            </button>

          </article>


          <!-- MY CONTENT -->

          <article class="card">

            <span class="card-icon">
              📚
            </span>

            <h3>
              My Content
            </h3>

            <p>
              Manage the content you have created
              and uploaded.
            </p>

            <button class="btn secondary">
              Manage Content
            </button>

          </article>


          <!-- ANALYTICS -->

          <article class="card">

            <span class="card-icon">
              📊
            </span>

            <h3>
              Analytics
            </h3>

            <p>
              View content performance,
              views and engagement.
            </p>

            <button class="btn secondary">
              View Analytics
            </button>

          </article>

        </div>

        <div class="content-card">

          <h2>
            Creator Dashboard
          </h2>

          <p>
            Your creator tools will connect
            to authentication, storage and
            database services as the platform
            develops.
          </p>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Wallet
     ------------------------------------------------------- */

  function renderWallet() {

    return pageTemplate({

      icon: "◇",

      eyebrow:
        "FINANCE",

      title:
        "Wallet",

      subtitle:
        "Creator earnings and support.",

      content: `

        <div class="content-card">

          <h2>
            Wallet
          </h2>

          <p>
            Your creator earnings, donations
            and financial activity will appear here.
          </p>

          <div class="cards-grid">

            <article class="card">

              <h3>
                Balance
              </h3>

              <p>
                0.00
              </p>

            </article>

            <article class="card">

              <h3>
                Transactions
              </h3>

              <p>
                No transactions yet.
              </p>

            </article>

          </div>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Admin
     ------------------------------------------------------- */

  function renderAdmin() {

    return pageTemplate({

      icon: "⚙",

      eyebrow:
        "ADMINISTRATION",

      title:
        "Admin",

      subtitle:
        "Manage the Apostolic Media platform.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              👥
            </span>

            <h3>
              Users
            </h3>

            <p>
              Manage platform users and roles.
            </p>

            <button class="btn secondary">
              Manage Users
            </button>

          </article>

          <article class="card">

            <span class="card-icon">
              🛡️
            </span>

            <h3>
              Moderation
            </h3>

            <p>
              Review reports and community content.
            </p>

            <button class="btn secondary">
              Moderation
            </button>

          </article>

          <article class="card">

            <span class="card-icon">
              📊
            </span>

            <h3>
              Analytics
            </h3>

            <p>
              Platform statistics and activity.
            </p>

            <button class="btn secondary">
              Analytics
            </button>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Settings
     ------------------------------------------------------- */

  function renderSettings() {

    return pageTemplate({

      icon: "⚙️",

      eyebrow:
        "SETTINGS",

      title:
        "Settings",

      subtitle:
        "Manage your Apostolic Media preferences.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              🌙
            </span>

            <h3>
              Appearance
            </h3>

            <p>
              Choose light, dark or system theme.
            </p>

            <div class="hero-actions">

              <button
                class="btn secondary"
                data-theme="light"
              >
                Light
              </button>

              <button
                class="btn secondary"
                data-theme="dark"
              >
                Dark
              </button>

              <button
                class="btn secondary"
                data-theme="system"
              >
                System
              </button>

            </div>

          </article>


          <article class="card">

            <span class="card-icon">
              🌐
            </span>

            <h3>
              Language
            </h3>

            <p>
              Choose your preferred interface language.
            </p>

            <div class="hero-actions">

              <button
                class="btn secondary"
                data-language="en"
              >
                English
              </button>

              <button
                class="btn secondary"
                data-language="am"
              >
                አማርኛ
              </button>

              <button
                class="btn secondary"
                data-language="om"
              >
                Afaan Oromoo
              </button>

            </div>

          </article>


          <article class="card">

            <span class="card-icon">
              📶
            </span>

            <h3>
              Data Saver
            </h3>

            <p>
              Reduce data usage when using mobile networks.
            </p>

            <button class="btn secondary">
              Configure
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              🔔
            </span>

            <h3>
              Notifications
            </h3>

            <p>
              Manage your notification preferences.
            </p>

            <a
              href="#notifications"
              class="btn secondary"
            >
              Notification Settings →
            </a>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     About
     ------------------------------------------------------- */

  function renderAbout() {

    return pageTemplate({

      icon: "🕎",

      eyebrow:
        "ABOUT",

      title:
        "About Apostolic Media",

      subtitle:
        "የኢየሱስ ልጆች Apostolic Media",

      content: `

        <div class="content-card">

          <h2>
            Our Mission
          </h2>

          <p>
            Apostolic Media is designed to bring
            Bible resources, Christian teachings,
            worship, sermons, learning and community
            together in one digital platform.
          </p>

          <p>
            Wherever you are, join the same
            Apostolic Christian community.
          </p>

          <p>
            Version 1.0.0
          </p>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Profile
     ------------------------------------------------------- */

  function renderProfile() {

    return pageTemplate({

      icon: "G",

      eyebrow:
        "ACCOUNT",

      title:
        "Profile",

      subtitle:
        "Your Apostolic Media account.",

      content: `

        <div class="content-card">

          <div class="avatar"
               style="width:80px;height:80px;">
            G
          </div>

          <h2>
            Guest User
          </h2>

          <p>
            Sign in to create your profile,
            save content and access creator tools.
          </p>

          <div class="hero-actions">

            <button class="btn primary">
              Sign In
            </button>

            <button class="btn secondary">
              Create Account
            </button>

          </div>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Notifications
     ------------------------------------------------------- */

  function renderNotifications() {

    return pageTemplate({

      icon: "🔔",

      eyebrow:
        "NOTIFICATIONS",

      title:
        "Notifications",

      subtitle:
        "Stay updated with Apostolic Media.",

      content: `

        <div class="content-card">

          <h2>
            No new notifications
          </h2>

          <p>
            Your latest notifications will appear here.
          </p>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Courses
     ------------------------------------------------------- */

  function renderCourses() {

    return pageTemplate({

      icon: "🎓",

      eyebrow:
        "LEARNING",

      title:
        "Courses",

      subtitle:
        "Christian learning and discipleship.",

      content: `

        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              📚
            </span>

            <h3>
              Christian Foundations
            </h3>

            <p>
              Learn the foundations of Christian faith.
            </p>

            <button class="btn primary">
              Start Course
            </button>

          </article>

          <article class="card">

            <span class="card-icon">
              📖
            </span>

            <h3>
              Bible Study Course
            </h3>

            <p>
              Study Scripture in a structured way.
            </p>

            <button class="btn secondary">
              View Course
            </button>

          </article>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Artists
     ------------------------------------------------------- */

  function renderArtists() {

    return pageTemplate({

      icon: "🎤",

      eyebrow:
        "MINISTERS",

      title:
        "Artists & Ministers",

      subtitle:
        "Christian ministers and creators.",

      content: `

        <div class="content-card">

          <h2>
            Artists & Ministers
          </h2>

          <p>
            Christian artists, singers,
            teachers and ministers will appear here.
          </p>

          <button class="btn primary">
            Explore Ministers
          </button>

        </div>
      `
    });
  }


  /* -------------------------------------------------------
     Generic Content Page
     ------------------------------------------------------- */

  function renderGeneric(
    title,
    icon,
    description
  ) {

    return pageTemplate({

      icon: icon,

      eyebrow:
        "APOSTOLIC MEDIA",

      title:
        title,

      subtitle:
        description,

      content: `

        <div class="content-card">

          <h2>
            ${title}
          </h2>

          <p>
            ${description}
          </p>

          <a
            href="#home"
            class="btn primary"
          >
            ← Back to Home
          </a>

        </div>
      `
    });
  }


  /* =======================================================
     PAGE RENDERER
     ======================================================= */

  function renderPage(page) {

    const main =
      document.getElementById(
        "mainContent"
      );

    if (!main) {
      return;
    }

    let html = "";

    switch (page) {

      case "home":
        html = renderHome();
        break;

      case "bible":
        html = renderBible();
        break;

      case "bible-study":
        html = renderBibleStudy();
        break;

      case "teachings":
        html = renderTeachings();
        break;

      case "sermons":
        html = renderSermons();
        break;

      case "songs":
        html = renderSongs();
        break;

      case "lyrics":
        html = renderLyrics();
        break;

      case "videos":
        html = renderVideos();
        break;

      case "live":
        html = renderLive();
        break;

      case "community":
        html = renderCommunity();
        break;

      case "qa":
        html = renderQA();
        break;

      case "events":
        html = renderEvents();
        break;

      case "downloads":
        html = renderDownloads();
        break;

      case "saved":
        html = renderSaved();
        break;

      case "playlists":
        html = renderPlaylists();
        break;

      case "creator":
        html = renderCreator();
        break;

      case "wallet":
        html = renderWallet();
        break;

      case "admin":
        html = renderAdmin();
        break;

      case "settings":
        html = renderSettings();
        break;

      case "about":
        html = renderAbout();
        break;

      case "profile":
        html = renderProfile();
        break;

      case "notifications":
        html = renderNotifications();
        break;

      case "courses":
        html = renderCourses();
        break;

      case "artists":
        html = renderArtists();
        break;

      default:
        html = renderGeneric(
          "Page",
          "🕎",
          "This section is being prepared."
        );
        break;
    }

    main.innerHTML = html;

    /*
      Initialize controls added
      dynamically to the page.
    */
    initThemeControls();
    initLanguageControls();
    initActions();
  }


  /* =======================================================
     CREATOR ACTIONS
     ======================================================= */

  function initCreatorActions() {

    document.addEventListener(
      "click",
      function (event) {

        const createButton =
          event.target.closest(
            '[data-action="creator-create"]'
          );

        const uploadButton =
          event.target.closest(
            '[data-action="creator-upload"]'
          );


        if (createButton) {

          showCreateMenu();

          return;
        }


        if (uploadButton) {

          showUploadMenu();

          return;
        }

      }
    );
  }


  /* -------------------------------------------------------
     Create Menu
     ------------------------------------------------------- */

  function showCreateMenu() {

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

          <div class="page-header-icon">
            ➕
          </div>

          <div>

            <span class="eyebrow">
              CREATOR STUDIO
            </span>

            <h1>
              Create New Content
            </h1>

            <p>
              Choose the type of Christian content
              you want to create.
            </p>

          </div>

        </div>


        <div class="cards-grid">

          <article class="card">

            <span class="card-icon">
              🎵
            </span>

            <h3>
              Song
            </h3>

            <p>
              Create a Christian song.
            </p>

            <button class="btn primary">
              Create Song
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              📚
            </span>

            <h3>
              Teaching
            </h3>

            <p>
              Create a Bible teaching.
            </p>

            <button class="btn primary">
              Create Teaching
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              🎙️
            </span>

            <h3>
              Sermon
            </h3>

            <p>
              Create a sermon.
            </p>

            <button class="btn primary">
              Create Sermon
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              📝
            </span>

            <h3>
              Written Teaching
            </h3>

            <p>
              Create a Christian article
              or written teaching.
            </p>

            <button class="btn primary">
              Create Writing
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              📖
            </span>

            <h3>
              Bible Study
            </h3>

            <p>
              Create a Bible study lesson.
            </p>

            <button class="btn primary">
              Create Bible Study
            </button>

          </article>


          <article class="card">

            <span class="card-icon">
              🎬
            </span>

            <h3>
              Video
            </h3>

            <p>
              Create a Christian video.
            </p>

            <button class="btn primary">
              Create Video
            </button>

          </article>

        </div>


        <div class="hero-actions">

          <a
            href="#creator"
            class="btn secondary"
          >
            ← Back to Creator Studio
          </a>

        </div>

      </section>
    `;
  }


  /* -------------------------------------------------------
     Upload Menu
     ------------------------------------------------------- */

  function showUploadMenu() {

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

          <div class="page-header-icon">
            ⬆️
          </div>

          <div>

            <span class="eyebrow">
              CREATOR STUDIO
            </span>

            <h1>
              Upload Content
            </h1>

            <p>
              Upload Christian audio, video,
              documents, PDFs or images.
            </p>

          </div>

        </div>


        <div class="content-card">

          <div
            class="upload-area"
            style="
              border:2px dashed currentColor;
              padding:40px;
              text-align:center;
              border-radius:16px;
            "
          >

            <div
              style="
                font-size:3rem;
                margin-bottom:15px;
              "
            >
              ⬆️
            </div>

            <h2>
              Select a file
            </h2>

            <p>
              PDF, DOC, DOCX, audio, video,
              image and other supported files.
            </p>

            <label
              class="btn primary"
              style="
                display:inline-block;
                cursor:pointer;
              "
            >

              Choose File

              <input
                id="creatorFileInput"
                type="file"
                hidden
                accept="
                  .pdf,
                  .doc,
                  .docx,
                  .txt,
                  image/*,
                  audio/*,
                  video/*
                "
              >

            </label>

            <p
              id="selectedFileName"
              style="margin-top:15px;"
            >
              No file selected.
            </p>

          </div>

        </div>


        <div class="hero-actions">

          <a
            href="#creator"
            class="btn secondary"
          >
            ← Back to Creator Studio
          </a>

        </div>

      </section>
    `;


    const input =
      document.getElementById(
        "creatorFileInput"
      );

    const fileName =
      document.getElementById(
        "selectedFileName"
      );


    if (input) {

      input.addEventListener(
        "change",
        function () {

          if (
            !input.files ||
            !input.files.length
          ) {

            fileName.textContent =
              "No file selected.";

            return;
          }

          fileName.textContent =
            `Selected: ${input.files[0].name}`;

          toast(
            "File selected. Upload connection will be added with storage.",
            "success"
          );
        }
      );
    }
  }


  /* =======================================================
     Router Integration
     ======================================================= */

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


  /* =======================================================
     App Initialization
     ======================================================= */

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

    initCreatorActions();

    registerServiceWorker();

    document.body.classList.add(
      "app-ready"
    );

    console.log(
      `${APP.name} v${APP.version} initialized.`
    );
  }


  /* =======================================================
     Public API
     ======================================================= */

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


  /* =======================================================
     Start Application
     ======================================================= */

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
