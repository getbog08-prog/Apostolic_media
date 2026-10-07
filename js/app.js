/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Main Application Controller
   ========================================================= */

(function () {
  "use strict";

  const APP = {
    name: "የኢየሱስ ልጆች Apostolic Media",
    version: "1.2.0",
    defaultTheme: "system",
    defaultLanguage: "en"
  };

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

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

  const theme = {
    get() {
      return storage.get("apostolic_theme", APP.defaultTheme);
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
        value
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

  function initMobileMenu() {
    const menuButton =
      $(".menu-btn") ||
      $("[data-menu-toggle]") ||
      $(".mobile-menu-button") ||
      $('[data-action="toggle-sidebar"]');

    const sidebar =
      $(".sidebar") ||
      $("[data-sidebar]");

    if (!menuButton || !sidebar) return;

    menuButton.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      menuButton.classList.toggle("active");

      const isOpen =
        sidebar.classList.contains("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    $$(".nav-item, .sidebar a")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          if (window.innerWidth < 1024) {
            sidebar.classList.remove("open");
            menuButton.classList.remove("active");
          }
        });
      });
  }

  function initNavigation() {
    return;
  }

  function navigate(route) {
    if (!route) return;

    const cleanRoute =
      String(route).replace(/^#/, "").trim();

    if (window.ApostolicRouter) {
      window.ApostolicRouter.navigate(
        "#" + cleanRoute
      );
    } else {
      window.location.hash = cleanRoute;
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

  function initSearch() {
    const inputs = $$(
      'input[type="search"], .search-input, [data-search]'
    );

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        const query = input.value.trim();

        window.dispatchEvent(
          new CustomEvent("apostolic:search", {
            detail: { query }
          })
        );
      });

      input.addEventListener("keydown", function (event) {
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

  function initThemeControls() {
    $$("[data-theme], [data-set-theme]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          const selected =
            button.dataset.theme ||
            button.dataset.setTheme;

          if (selected) {
            theme.set(selected);
          }
        });
      });

    $$(".theme-toggle, [data-theme-toggle]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          theme.toggle();
        });
      });
  }

  function initLanguageControls() {
    $$("[data-language], [data-set-language]")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          const selected =
            button.dataset.language ||
            button.dataset.setLanguage;

          if (selected) {
            language.set(selected);
          }
        });
      });
  }

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

    requestAnimationFrame(function () {
      item.classList.add("show");
    });

    setTimeout(function () {
      item.classList.remove("show");

      setTimeout(function () {
        item.remove();
      }, 250);
    }, 3000);
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
     function closeDynamicModal(modal) {
    if (!modal) return;

    modal.remove();

    if (!$(".apostolic-modal")) {
      document.body.classList.remove("modal-open");
    }
  }

  function createModal(title, bodyHTML) {
    const modal = document.createElement("div");

    modal.className = "modal open apostolic-modal";
    modal.setAttribute("aria-hidden", "false");

    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${escapeHTML(title)}</h2>

          <button
            type="button"
            class="modal-close"
            data-modal-action="close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          ${bodyHTML}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.classList.add("modal-open");

    return modal;
  }

  function showCreateForm(title, type) {
    const modal = createModal(
      title,
      `
        <form
          class="dynamic-form"
          data-create-form="${escapeHTML(type)}"
        >

          <div class="form-group">
            <label for="createTitle">
              Title
            </label>

            <input
              id="createTitle"
              name="title"
              type="text"
              placeholder="Enter title"
              required
            />
          </div>

          <div class="form-group">
            <label for="createDescription">
              Description
            </label>

            <textarea
              id="createDescription"
              name="description"
              rows="5"
              placeholder="Write a description..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="createLanguage">
              Language
            </label>

            <select
              id="createLanguage"
              name="language"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Afaan Oromoo</option>
            </select>
          </div>

          <button
            type="submit"
            class="btn primary"
          >
            Create
          </button>

        </form>
      `
    );

    return modal;
  }

  function showUploadForm(title, type) {
    const modal = createModal(
      title,
      `
        <form
          class="dynamic-form"
          data-upload-form="${escapeHTML(type)}"
        >

          <div class="form-group">
            <label for="uploadTitle">
              Title
            </label>

            <input
              id="uploadTitle"
              name="title"
              type="text"
              placeholder="Enter title"
              required
            />
          </div>

          <div class="form-group">
            <label for="uploadFile">
              Select file
            </label>

            <input
              id="uploadFile"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.mp3,.mp4,.jpg,.jpeg,.png"
              required
            />
          </div>

          <div class="form-group">
            <label for="uploadDescription">
              Description
            </label>

            <textarea
              id="uploadDescription"
              name="description"
              rows="4"
              placeholder="Write a description..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn primary"
          >
            Upload
          </button>

        </form>
      `
    );

    return modal;
  }

  function initPageActionDelegation() {
    document.addEventListener("click", function (event) {
      const actionElement =
        event.target.closest("[data-page-action]");

      if (actionElement) {
        event.preventDefault();

        const action =
          actionElement.dataset.pageAction;

        handlePageAction(action);

        return;
      }

      const modalClose =
        event.target.closest("[data-modal-action='close']");

      if (modalClose) {
        event.preventDefault();

        const modal =
          modalClose.closest(".apostolic-modal");

        closeDynamicModal(modal);

        return;
      }

      const modal =
        event.target.closest(".apostolic-modal");

      if (
        modal &&
        event.target === modal
      ) {
        closeDynamicModal(modal);
      }
    });

    document.addEventListener("submit", function (event) {
      const uploadForm =
        event.target.closest("[data-upload-form]");

      if (uploadForm) {
        event.preventDefault();

        handleUploadSubmit(uploadForm);

        return;
      }

      const createForm =
        event.target.closest("[data-create-form]");

      if (createForm) {
        event.preventDefault();

        handleCreateSubmit(createForm);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;

      const modal = $(".apostolic-modal");

      if (modal) {
        closeDynamicModal(modal);
      }
    });
  }

  function handlePageAction(action) {
    switch (action) {
      case "create-teaching":
        showCreateForm(
          "Create Teaching",
          "teaching"
        );
        break;

      case "create-sermon":
        showCreateForm(
          "Create Sermon",
          "sermon"
        );
        break;

      case "create-song":
        showCreateForm(
          "Create Song",
          "song"
        );
        break;

      case "create-lyric":
        showCreateForm(
          "Create Lyrics",
          "lyric"
        );
        break;

      case "create-course":
        showCreateForm(
          "Create Course",
          "course"
        );
        break;

      case "create-event":
        showCreateForm(
          "Create Event",
          "event"
        );
        break;

      case "create-playlist":
        showCreateForm(
          "Create Playlist",
          "playlist"
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
          "Upload Song",
          "song"
        );
        break;

      case "upload-video":
        showUploadForm(
          "Upload Video",
          "video"
        );
        break;

      case "upload-bible":
        showUploadForm(
          "Upload Bible Resource",
          "bible"
        );
        break;

      case "upload-course":
        showUploadForm(
          "Upload Course Material",
          "course"
        );
        break;

      case "upload-document":
        showUploadForm(
          "Upload Document",
          "document"
        );
        break;

      default:
        toast(
          "This feature is not available yet.",
          "info"
        );
    }
  }

  function handleUploadSubmit(form) {
    const formData = new FormData(form);

    const title =
      String(formData.get("title") || "").trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    const file =
      formData.get("file");

    const type =
      form.dataset.uploadForm || "document";

    if (!title) {
      toast(
        "Please enter a title.",
        "error"
      );

      return;
    }

    if (
      !file ||
      !file.name
    ) {
      toast(
        "Please select a file.",
        "error"
      );

      return;
    }

    const uploads =
      storage.get(
        "apostolic_uploads",
        []
      );

    uploads.push({
      id:
        Date.now().toString(),

      title,

      description,

      type,

      fileName:
        file.name,

      fileSize:
        file.size,

      fileType:
        file.type,

      createdAt:
        new Date().toISOString()
    });

    storage.set(
      "apostolic_uploads",
      uploads
    );

    const modal =
      form.closest(".apostolic-modal");

    closeDynamicModal(modal);

    toast(
      `"${title}" uploaded successfully.`,
      "success"
    );
  }

  function handleCreateSubmit(form) {
    const formData =
      new FormData(form);

    const title =
      String(
        formData.get("title") || ""
      ).trim();

    const description =
      String(
        formData.get("description") || ""
      ).trim();

    const selectedLanguage =
      String(
        formData.get("language") || "en"
      );

    const type =
      form.dataset.createForm ||
      "content";

    if (!title) {
      toast(
        "Please enter a title.",
        "error"
      );

      return;
    }

    const items =
      storage.get(
        "apostolic_created_items",
        []
      );

    items.push({
      id:
        Date.now().toString(),

      title,

      description,

      language:
        selectedLanguage,

      type,

      createdAt:
        new Date().toISOString()
    });

    storage.set(
      "apostolic_created_items",
      items
    );

    const modal =
      form.closest(".apostolic-modal");

    closeDynamicModal(modal);

    toast(
      `"${title}" created successfully.`,
      "success"
    );
  }

  function initActions() {
    document.addEventListener(
      "click",
      function (event) {
        const likeButton =
          event.target.closest(
            "[data-like]"
          );

        if (likeButton) {
          event.preventDefault();

          const active =
            likeButton.classList.toggle(
              "active"
            );

          likeButton.setAttribute(
            "aria-pressed",
            String(active)
          );

          toast(
            active
              ? "Added to likes."
              : "Removed from likes.",
            "success"
          );

          return;
        }

        const saveButton =
          event.target.closest(
            "[data-save]"
          );

        if (saveButton) {
          event.preventDefault();

          const active =
            saveButton.classList.toggle(
              "active"
            );

          saveButton.setAttribute(
            "aria-pressed",
            String(active)
          );

          toast(
            active
              ? "Saved successfully."
              : "Removed from saved items.",
            "success"
          );
        }
      }
    );
  }
     function initBackToTop() {
    const button =
      $("[data-back-to-top]") ||
      $(".back-to-top");

    if (!button) return;

    window.addEventListener("scroll", function () {
      button.classList.toggle(
        "show",
        window.scrollY > 400
      );
    });

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  function initConnectionStatus() {
    function updateStatus() {
      document.documentElement.classList.toggle(
        "offline",
        !navigator.onLine
      );

      window.dispatchEvent(
        new CustomEvent(
          "apostolic:connection",
          {
            detail: {
              online: navigator.onLine
            }
          }
        )
      );
    }

    window.addEventListener(
      "online",
      updateStatus
    );

    window.addEventListener(
      "offline",
      updateStatus
    );

    updateStatus();
  }

  function initServiceWorker() {
    if (
      "serviceWorker" in navigator
    ) {
      window.addEventListener(
        "load",
        function () {
          navigator.serviceWorker
            .register("./sw.js")
            .catch(function () {
              // Service worker is optional.
            });
        }
      );
    }
  }

  function initKeyboardShortcuts() {
    document.addEventListener(
      "keydown",
      function (event) {
        if (
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() === "k"
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

  function initErrorHandling() {
    window.addEventListener(
      "error",
      function (event) {
        console.error(
          "Apostolic Media error:",
          event.error || event.message
        );
      }
    );

    window.addEventListener(
      "unhandledrejection",
      function (event) {
        console.error(
          "Apostolic Media promise error:",
          event.reason
        );
      }
    );
  }

  const pages = {

    home: {
      title: "Home",
      subtitle:
        "Welcome to Apostolic Media.",

      content: `
        <section class="page-hero">
          <span class="eyebrow">
            APOSTOLIC MEDIA
          </span>

          <h1>
            የኢየሱስ ልጆች
            Apostolic Media
          </h1>

          <p>
            Wherever you are, join the same
            Apostolic Christian community.
          </p>
        </section>

        <section class="content-grid">

          <article class="card">
            <h3>Teachings</h3>
            <p>
              Biblical teachings and Christian
              study materials.
            </p>

            ${renderAction(
              "Open Teachings",
              "teachings"
            )}
          </article>

          <article class="card">
            <h3>Sermons</h3>
            <p>
              Listen to Apostolic sermons and
              messages.
            </p>

            ${renderAction(
              "Open Sermons",
              "sermons"
            )}
          </article>

          <article class="card">
            <h3>Bible</h3>
            <p>
              Read and study the Holy Bible.
            </p>

            ${renderAction(
              "Open Bible",
              "bible"
            )}
          </article>

          <article class="card">
            <h3>Community</h3>
            <p>
              Connect with other believers.
            </p>

            ${renderAction(
              "Open Community",
              "community"
            )}
          </article>

        </section>
      `
    },

    bible: {
      title: "Bible",
      subtitle:
        "Read and study the Holy Bible.",

      content: `
        <section class="page-hero">
          <span class="eyebrow">
            SCRIPTURE
          </span>

          <h1>Bible</h1>

          <p>
            Explore Scripture and Bible resources.
          </p>
        </section>

        <div class="card">
          <h3>Bible Reader</h3>

          <p>
            Bible reading features will be
            connected here.
          </p>

          ${renderAction(
            "Bible Study",
            "bible-study"
          )}
        </div>
      `
    },

    "bible-study": {
      title: "Bible Study",
      subtitle:
        "Structured Bible study materials.",

      content: `
        <section class="page-hero">
          <span class="eyebrow">
            SCRIPTURE
          </span>

          <h1>Bible Study</h1>

          <p>
            Scripture-based study and teaching.
          </p>
        </section>

        <div class="card">
          <h3>Study Series</h3>

          <p>
            Bible study series will appear here.
          </p>

          ${renderAction(
            "Create Study",
            "create-teaching"
          )}
        </div>
      `
    },

    teachings: {
      title: "Teachings",
      subtitle:
        "Christian teachings and Bible studies.",

      content: `
        <section class="page-hero">
          <span class="eyebrow">
            TEACHINGS
          </span>

          <h1>Teachings</h1>

          <p>
            Original Christian teachings and
            Bible studies.
          </p>

          <div class="page-actions">
            ${renderAction(
              "Create Teaching",
              "create-teaching"
            )}

            ${renderAction(
              "Upload Teaching",
              "upload-teaching"
            )}
          </div>
        </section>

        <div class="content-grid">

          <article class="card">
            <h3>Christian Teachings</h3>

            <p>
              Biblical teaching materials for
              spiritual growth.
            </p>
          </article>

          <article class="card">
            <h3>Bible Studies</h3>

            <p>
              Scripture-based studies and
              explanations.
            </p>
          </article>

        </div>
      `
    },

    sermons: {
      title: "Sermons",
      subtitle:
        "Apostolic sermons and messages.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            SERMONS
          </span>

          <h1>Sermons</h1>

          <p>
            Listen to Apostolic Christian
            sermons and messages.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Sermon",
              "create-sermon"
            )}

            ${renderAction(
              "Upload Sermon",
              "upload-sermon"
            )}

          </div>

        </section>
      `
    },

    songs: {
      title: "Songs",
      subtitle:
        "Apostolic Christian songs.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            MUSIC
          </span>

          <h1>Songs</h1>

          <p>
            Discover Christian songs and music.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Song",
              "create-song"
            )}

            ${renderAction(
              "Upload Song",
              "upload-song"
            )}

          </div>

        </section>
      `
    },

    lyrics: {
      title: "Lyrics",
      subtitle:
        "Christian song lyrics.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            LYRICS
          </span>

          <h1>Lyrics</h1>

          <p>
            Read Christian song lyrics.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Lyrics",
              "create-lyric"
            )}

          </div>

        </section>
      `
    },

    videos: {
      title: "Videos",
      subtitle:
        "Christian video content.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            VIDEO
          </span>

          <h1>Videos</h1>

          <p>
            Watch Christian media and teachings.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Upload Video",
              "upload-video"
            )}

          </div>

        </section>
      `
    },

    community: {
      title: "Community",
      subtitle:
        "Connect with believers.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            COMMUNITY
          </span>

          <h1>Community</h1>

          <p>
            Connect, discuss and encourage
            one another.
          </p>

        </section>

        <div class="card">

          <h3>Apostolic Community</h3>

          <p>
            Community features will appear here.
          </p>

        </div>
      `
    },

    qa: {
      title: "Q&A",
      subtitle:
        "Ask and answer Christian questions.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            COMMUNITY
          </span>

          <h1>Questions & Answers</h1>

          <p>
            Ask Bible and Christian-life questions.
          </p>

        </section>
      `
    },

    live: {
      title: "Live",
      subtitle:
        "Live Apostolic broadcasts.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            LIVE
          </span>

          <h1>Live</h1>

          <p>
            Live broadcasting features will
            appear here.
          </p>

        </section>
      `
    },

    events: {
      title: "Events",
      subtitle:
        "Apostolic Christian events.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            EVENTS
          </span>

          <h1>Events</h1>

          <p>
            Discover upcoming Christian events.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Event",
              "create-event"
            )}

          </div>

        </section>
      `
    },

    playlists: {
      title: "Playlists",
      subtitle:
        "Organize your favorite content.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            PLAYLISTS
          </span>

          <h1>Playlists</h1>

          <p>
            Create and manage your playlists.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Playlist",
              "create-playlist"
            )}

          </div>

        </section>
      `
    },

    artists: {
      title: "Artists & Ministers",
      subtitle:
        "Discover Christian ministers and creators.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            MINISTRY
          </span>

          <h1>Artists & Ministers</h1>

          <p>
            Discover Apostolic ministers,
            musicians and creators.
          </p>

        </section>
      `
    },

    courses: {
      title: "Courses",
      subtitle:
        "Christian learning courses.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            LEARNING
          </span>

          <h1>Courses</h1>

          <p>
            Learn through structured Christian
            courses.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Course",
              "create-course"
            )}

            ${renderAction(
              "Upload Course",
              "upload-course"
            )}

          </div>

        </section>
      `
    },

    profile: {
      title: "Profile",
      subtitle:
        "Manage your profile.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            ACCOUNT
          </span>

          <h1>Profile</h1>

          <p>
            Your profile information will
            appear here.
          </p>

        </section>
      `
    },

    notifications: {
      title: "Notifications",
      subtitle:
        "Your latest notifications.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            ACCOUNT
          </span>

          <h1>Notifications</h1>

          <p>
            You have no new notifications.
          </p>

        </section>
      `
    },

    downloads: {
      title: "Downloads",
      subtitle:
        "Your downloaded resources.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            LIBRARY
          </span>

          <h1>Downloads</h1>

          <p>
            Downloaded resources will appear here.
          </p>

        </section>
      `
    },

    saved: {
      title: "Saved",
      subtitle:
        "Your saved content.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            LIBRARY
          </span>

          <h1>Saved</h1>

          <p>
            Your saved content will appear here.
          </p>

        </section>
      `
    },

    creator: {
      title: "Creator Dashboard",
      subtitle:
        "Manage your Christian content.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            CREATOR
          </span>

          <h1>Creator Dashboard</h1>

          <p>
            Create, upload and manage your
            content.
          </p>

          <div class="page-actions">

            ${renderAction(
              "Create Teaching",
              "create-teaching"
            )}

            ${renderAction(
              "Upload Document",
              "upload-document"
            )}

          </div>

        </section>
      `
    },

    wallet: {
      title: "Wallet",
      subtitle:
        "Creator earnings and support.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            WALLET
          </span>

          <h1>Wallet</h1>

          <p>
            Wallet and creator-support features
            will appear here.
          </p>

        </section>
      `
    },

    admin: {
      title: "Admin",
      subtitle:
        "Platform administration.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            ADMIN
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Administration features will appear
            here.
          </p>

        </section>
      `
    },

    settings: {
      title: "Settings",
      subtitle:
        "Customize your Apostolic Media experience.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            SETTINGS
          </span>

          <h1>Settings</h1>

          <div class="content-grid">

            <article class="card">

              <h3>Theme</h3>

              <p>
                Choose light, dark or system theme.
              </p>

              <div class="page-actions">

                <button
                  class="btn"
                  data-theme="light"
                >
                  Light
                </button>

                <button
                  class="btn"
                  data-theme="dark"
                >
                  Dark
                </button>

                <button
                  class="btn"
                  data-theme="system"
                >
                  System
                </button>

              </div>

            </article>

            <article class="card">

              <h3>Language</h3>

              <p>
                Choose your interface language.
              </p>

              <div class="page-actions">

                <button
                  class="btn"
                  data-language="en"
                >
                  English
                </button>

                <button
                  class="btn"
                  data-language="am"
                >
                  አማርኛ
                </button>

                <button
                  class="btn"
                  data-language="om"
                >
                  Afaan Oromoo
                </button>

              </div>

            </article>

          </div>

        </section>
      `
    },

    about: {
      title: "About",
      subtitle:
        "About Apostolic Media.",

      content: `
        <section class="page-hero">

          <span class="eyebrow">
            ABOUT
          </span>

          <h1>
            የኢየሱስ ልጆች Apostolic Media
          </h1>

          <p>
            Wherever you are, join the same
            Apostolic Christian community.
          </p>

        </section>
      `
    }

  };

  function renderAction(label, action) {
    return `
      <button
        type="button"
        class="btn primary"
        data-page-action="${escapeHTML(action)}"
      >
        ${escapeHTML(label)}
      </button>
    `;
  }

  function renderPage(route) {
    const main =
      $("#mainContent");

    if (!main) return;

    const cleanRoute =
      String(route || "home")
        .replace(/^#/, "")
        .trim();

    const page =
      pages[cleanRoute] ||
      pages.home;

    activateNavigation(
      cleanRoute
    );

    main.innerHTML = `
      <div class="page-container">

        ${page.content}

      </div>
    `;

    initThemeControls();
    initLanguageControls();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function initRouter() {
    window.addEventListener(
      "pageLoad",
      function (event) {
        const route =
          event.detail &&
          event.detail.route
            ? event.detail.route
            : window.location.hash;

        renderPage(route);
      }
    );

    const initialRoute =
      window.location.hash
        ? window.location.hash.substring(1)
        : "home";

    if (
      window.ApostolicRouter
    ) {
      window.ApostolicRouter.init();

      window.ApostolicRouter.navigate(
        "#" + initialRoute
      );
    } else {
      renderPage(initialRoute);
    }
  }

  function init() {
    theme.init();

    language.init();

    initMobileMenu();

    initNavigation();

    initSearch();

    initThemeControls();

    initLanguageControls();

    initPageActionDelegation();

    initActions();

    initBackToTop();

    initConnectionStatus();

    initServiceWorker();

    initKeyboardShortcuts();

    initVisibility();

    initErrorHandling();

    initRouter();

    window.dispatchEvent(
      new CustomEvent(
        "apostolic:ready",
        {
          detail: {
            app: APP
          }
        }
      )
    );
  }

  window.ApostolicApp = {
    version: APP.version,

    navigate,

    renderPage,

    toast,

    theme,

    language,

    storage,

    getAppInfo() {
      return {
        name: APP.name,
        version: APP.version
      };
    }
  };

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
