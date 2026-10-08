/* =========================================================
   የኢየሱስ ልጆች Apostolic Media
   Main Application Controller
   ========================================================= */

(function () {
  "use strict";

  const APP = {
    name: "የኢየሱስ ልጆች Apostolic Media",
    version: "1.3.0",
    defaultTheme: "system",
    defaultLanguage: "en"
  };

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  /* =========================================================
     STORAGE
     ========================================================= */

  const storage = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {}
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {}
    }
  };

  /* =========================================================
     THEME
     ========================================================= */

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

  /* =========================================================
     LANGUAGE
     ========================================================= */

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

  /* =========================================================
     MOBILE MENU
     ========================================================= */

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

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

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

    $$(".sidebar a").forEach(function (item) {
      item.addEventListener("click", function () {
        if (window.innerWidth < 1024) {
          sidebar.classList.remove("open");
          menuButton.classList.remove("active");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      });
    });
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function initNavigation() {
    /*
      Navigation is handled by router.js.
      Keeping this function prevents duplicate navigation
      listeners from being created.
    */
  }

  function navigate(route) {
    if (!route) return;

    const cleanRoute =
      String(route)
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

  /* =========================================================
     SEARCH
     ========================================================= */

  function initSearch() {
    const inputs = $$(
      'input[type="search"], .search-input, [data-search]'
    );

    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        const query =
          input.value.trim();

        window.dispatchEvent(
          new CustomEvent("apostolic:search", {
            detail: { query }
          })
        );
      });

      input.addEventListener(
        "keydown",
        function (event) {
          if (event.key !== "Enter") return;

          const query =
            input.value.trim();

          if (!query) return;

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

  /* =========================================================
     THEME CONTROLS
     ========================================================= */

  function initThemeControls() {
    $$("[data-theme], [data-set-theme]")
      .forEach(function (button) {
        if (button.dataset.themeBound) return;

        button.dataset.themeBound = "true";

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
        if (button.dataset.themeToggleBound) return;

        button.dataset.themeToggleBound = "true";

        button.addEventListener(
          "click",
          function () {
            theme.toggle();
          }
        );
      });
  }

  /* =========================================================
     LANGUAGE CONTROLS
     ========================================================= */

  function initLanguageControls() {
    $$("[data-language], [data-set-language]")
      .forEach(function (button) {
        if (button.dataset.languageBound) return;

        button.dataset.languageBound = "true";

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

  /* =========================================================
     TOAST
     ========================================================= */

  function toast(
    message,
    type = "info"
  ) {
    let container =
      $("#toastRoot") ||
      $(".toast-container");

    if (!container) {
      container =
        document.createElement("div");

      container.id =
        "toastRoot";

      container.className =
        "toast-root";

      container.setAttribute(
        "aria-live",
        "polite"
      );

      container.setAttribute(
        "aria-atomic",
        "true"
      );

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

  /* =========================================================
     HTML ESCAPE
     ========================================================= */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     MODALS
     ========================================================= */

  function closeDynamicModal(modal) {
    if (!modal) return;

    modal.remove();

    if (!$(".apostolic-modal")) {
      document.body.classList.remove(
        "modal-open"
      );
    }
  }

  function createModal(
    title,
    bodyHTML
  ) {
    const modal =
      document.createElement("div");

    modal.className =
      "modal open apostolic-modal";

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

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

    document.body.appendChild(
      modal
    );

    document.body.classList.add(
      "modal-open"
    );

    return modal;
  }

  function showCreateForm(
    title,
    type
  ) {
    return createModal(
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
              <option value="en">
                English
              </option>

              <option value="am">
                አማርኛ
              </option>

              <option value="om">
                Afaan Oromoo
              </option>
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
  }

  function showUploadForm(
    title,
    type
  ) {
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

          <div
            class="upload-status"
            hidden
            role="status"
            aria-live="polite"
          ></div>

          <button
            type="button"
            class="btn primary"
            data-upload-submit
          >
            Upload
          </button>

        </form>
      `
    );

    const uploadButton = modal.querySelector(
      "[data-upload-submit]"
    );

    const uploadForm = modal.querySelector(
      "[data-upload-form]"
    );

    if (uploadButton && uploadForm) {
      uploadButton.addEventListener("click", function (event) {
        event.preventDefault();
        handleUploadSubmit(uploadForm);
      });
    }

    return modal;
  }

  /* =========================================================
     COMMUNITY
     ========================================================= */

  function showCommunityPostForm(post = null) {
    const editing = !!post;
    return createModal(
      editing ? "Edit Community Post" : "Create Community Post",
      '<form class="dynamic-form" data-community-form' +
        (editing ? ' data-edit-id="' + escapeHTML(post.id) + '"' : '') + '>' +
        '<div class="form-group"><label>Title</label><input name="title" type="text" value="' + escapeHTML(post?.title || '') + '"></div>' +
        '<div class="form-group"><label>Message</label><textarea name="content" rows="6" required>' + escapeHTML(post?.content || '') + '</textarea></div>' +
        '<button type="submit" class="btn primary">' + (editing ? "Save Changes" : "Publish") + '</button>' +
      '</form>'
    );
  }

  function contentActionButtons(type, id, ownerId = null) {
    const auth = window.ApostolicAuth;
    const user = auth && auth.getUser ? auth.getUser() : null;
    const canManage = !!user && !!ownerId && user.id === ownerId;
    if (!canManage) return "";
    return '<div class="card-actions">' +
      '<button type="button" class="btn" data-content-action="edit" data-content-type="' + escapeHTML(type) + '" data-content-id="' + escapeHTML(id) + '">Edit</button>' +
      '<button type="button" class="btn" data-content-action="delete" data-content-type="' + escapeHTML(type) + '" data-content-id="' + escapeHTML(id) + '">Delete</button>' +
    '</div>';
  }

  async function loadCommunityPosts() {
    const route = (window.location.hash || "").substring(1);
    if (route !== "community") return;
    const container = $(".page-container");
    if (!container) return;
    const section = document.createElement("section");
    section.className = "content-grid media-content-grid";
    section.innerHTML = '<article class="card"><div class="card-icon">⏳</div><h3>Community Posts</h3><p>Loading posts...</p></article>';
    container.appendChild(section);

    const api = window.ApostolicSupabase;
    if (!api || !api.isConfigured()) {
      section.innerHTML = renderCard("💬", "Community Posts", "Supabase is not configured yet.");
      return;
    }

    try {
      const result = await api.select("community_posts", "*", {
        order: { column: "created_at", ascending: false },
        limit: 50
      });
      const posts = result && Array.isArray(result.data) ? result.data : [];
      section.innerHTML = posts.length
        ? posts.map(function (post) {
            const actions = renderEngagementActions("community_post", post.id) +
              '<button type="button" class="btn" data-content-action="comments" data-content-type="community_post" data-content-id="' + escapeHTML(post.id) + '" data-content-title="' + escapeHTML(post.title || "Community Post") + '">Comments</button>' +
              contentActionButtons("community_post", post.id, post.user_id);
            return renderCard("💬", post.title || "Christian Community", post.content || "", actions);
          }).join("")
        : renderCard("💬", "No Posts Yet", "Be the first to share encouragement with the community.");
    } catch (error) {
      console.error("Community load failed:", error);
      section.innerHTML = renderCard("⚠️", "Community", "Could not load community posts right now.");
    }
  }

  /* =========================================================
     AUTHENTICATION UI
     ========================================================= */

  function showAuthForm(mode = "login") {
    const isLogin = mode === "login";
    const nameField = isLogin
      ? ""
      : '<div class="form-group"><label>Name</label><input name="name" type="text" required></div>';
    const title = isLogin ? "Sign In" : "Create Account";
    const submit = isLogin ? "Sign In" : "Create Account";
    const switchAction = isLogin ? "sign-up" : "sign-in";
    const switchLabel = isLogin ? "Create an account" : "Already have an account? Sign in";

    return createModal(
      title,
      '<form class="dynamic-form" data-auth-form="' + (isLogin ? "login" : "signup") + '">' +
        nameField +
        '<div class="form-group"><label>Email</label><input name="email" type="email" required></div>' +
        '<div class="form-group"><label>Password</label><input name="password" type="password" minlength="6" required></div>' +
        '<button type="submit" class="btn primary">' + submit + '</button>' +
        '<button type="button" class="btn" data-page-action="' + switchAction + '">' + switchLabel + '</button>' +
      '</form>'
    );
  }

  function requireCreatorAuth(callback) {
    const auth = window.ApostolicAuth;
    if (!auth || !auth.isLoggedIn()) {
      toast("Please sign in first to create or upload content.", "error");
      showAuthForm("login");
      return false;
    }
    if (typeof callback === "function") callback();
    return true;
  }

  /* =========================================================
     PAGE ACTIONS
     ========================================================= */

  function initPageActionDelegation() {
    document.addEventListener(
      "click",
      async function (event) {
        const actionElement =
          event.target.closest(
            "[data-page-action]"
          );

        if (actionElement) {
          event.preventDefault();

          handlePageAction(
            actionElement.dataset.pageAction
          );

          return;
        }

        const roleButton=event.target.closest("[data-admin-role-id]");
        if(roleButton){
          event.preventDefault();
          if(!requireLogin()) return;
          const role=window.prompt("Enter role: user, creator, minister, admin", "creator");
          if(!["user","creator","minister","admin"].includes(role)) return;
          try{
            const result=await window.ApostolicSupabase.update("profiles",{role:role},{id:roleButton.dataset.adminRoleId});
            if(result?.error) throw result.error;
            toast("User role updated.","success"); renderPage("admin");
          }catch(e){toast(e?.message||"Could not update role.","error");}
          return;
        }
        const mediaPublishButton=event.target.closest("[data-admin-media-id]");
        if(mediaPublishButton){
          event.preventDefault(); if(!requireLogin()) return;
          try{
            const result=await window.ApostolicSupabase.update("media_uploads",{is_published:mediaPublishButton.dataset.adminPublish==="true"},{id:mediaPublishButton.dataset.adminMediaId});
            if(result?.error) throw result.error;
            toast("Media moderation updated.","success"); renderPage("admin");
          }catch(e){toast(e?.message||"Could not moderate media.","error");}
          return;
        }

        const publishButton=event.target.closest("[data-admin-post-id]");
        if(publishButton){
          event.preventDefault();
          if(!requireLogin()) return;
          try{
            const result=await window.ApostolicSupabase.update("community_posts",{is_published:publishButton.dataset.adminPublish==="true"},{id:publishButton.dataset.adminPostId});
            if(result?.error) throw result.error;
            toast("Post moderation updated.","success"); renderPage("admin");
          }catch(e){toast(e?.message||"Could not moderate post.","error");}
          return;
        }

        const contentAction = event.target.closest("[data-content-action]");
        if (contentAction) {
          event.preventDefault();
          handleContentAction(contentAction);
          return;
        }

        const modalClose =
          event.target.closest(
            "[data-modal-action='close']"
          );

        if (modalClose) {
          event.preventDefault();

          closeDynamicModal(
            modalClose.closest(
              ".apostolic-modal"
            )
          );

          return;
        }

        const modal =
          event.target.closest(
            ".apostolic-modal"
          );

        if (
          modal &&
          event.target === modal
        ) {
          closeDynamicModal(modal);
        }
      }
    );

    document.addEventListener(
      "submit",
      async function (event) {
        const folderForm = event.target.closest("[data-folder-form]");
        if (folderForm) {
          event.preventDefault();
          if (!requireLogin()) return;
          const data=new FormData(folderForm), api=window.ApostolicSupabase, user=currentUser(), editId=folderForm.dataset.editId||"";
          try {
            const payload={name:String(data.get("name")||"").trim(),description:String(data.get("description")||"").trim()};
            const result=editId ? await api.update("folders",payload,{id:editId,created_by:user.id}) : await api.insert("folders",{...payload,created_by:user.id});
            if(result?.error) throw result.error;
            closeDynamicModal(folderForm.closest(".apostolic-modal")); toast(editId ? "Folder updated." : "Folder created.","success"); renderPage("folders");
          } catch(e){toast(e?.message||"Could not save folder.","error");}
          return;
        }

        const playlistForm = event.target.closest("[data-playlist-form]");
        if (playlistForm) {
          event.preventDefault();
          if (!requireLogin()) return;
          const data=new FormData(playlistForm), api=window.ApostolicSupabase, user=currentUser(), editId=playlistForm.dataset.editId||"";
          try {
            const payload={name:String(data.get("name")||"").trim(),description:String(data.get("description")||"").trim(),is_public:data.get("is_public")==="on"};
            const result=editId ? await api.update("playlists",payload,{id:editId,user_id:user.id}) : await api.insert("playlists",{...payload,user_id:user.id});
            if(result?.error) throw result.error;
            closeDynamicModal(playlistForm.closest(".apostolic-modal")); toast(editId ? "Playlist updated." : "Playlist created.","success"); renderPage("playlists");
          } catch(e){toast(e?.message||"Could not save playlist.","error");}
          return;
        }

        const playlistSongsForm = event.target.closest("[data-playlist-songs-form]");
        if (playlistSongsForm) {
          event.preventDefault();
          if (!requireLogin()) return;
          const data=new FormData(playlistSongsForm), api=window.ApostolicSupabase, playlistId=playlistSongsForm.dataset.playlistId, ids=data.getAll("song_ids");
          try {
            const existing=await api.select("playlist_songs","*",{eq:{playlist_id:playlistId},limit:200});
            for(const row of (existing?.data||[])){ const d=await api.remove("playlist_songs",{playlist_id:playlistId,song_id:row.song_id}); if(d?.error) throw d.error; }
            for(let i=0;i<ids.length;i++){ const r=await api.insert("playlist_songs",{playlist_id:playlistId,song_id:ids[i],position:i}); if(r?.error) throw r.error; }
            closeDynamicModal(playlistSongsForm.closest(".apostolic-modal")); toast("Playlist songs updated.","success"); renderPage("playlists");
          } catch(e){toast(e?.message||"Could not update playlist songs.","error");}
          return;
        }

        const eventForm = event.target.closest("[data-event-form]");
        if (eventForm) {
          event.preventDefault();
          if (!requireLogin()) return;
          const data=new FormData(eventForm), api=window.ApostolicSupabase, user=currentUser(), editId=eventForm.dataset.editId||"";
          try {
            const starts=String(data.get("starts_at")||""); if(!starts) throw new Error("Please choose the event start time.");
            const ends=String(data.get("ends_at")||"");
            const payload={title:String(data.get("title")||"").trim(),description:String(data.get("description")||"").trim(),location:String(data.get("location")||"").trim(),event_url:String(data.get("event_url")||"").trim()||null,starts_at:new Date(starts).toISOString(),ends_at:ends?new Date(ends).toISOString():null};
            const result=editId ? await api.update("events",payload,{id:editId,organizer_id:user.id}) : await api.insert("events",{...payload,organizer_id:user.id});
            if(result?.error) throw result.error;
            closeDynamicModal(eventForm.closest(".apostolic-modal")); toast(editId ? "Event updated." : "Event created.","success"); renderPage("events");
          } catch(e){toast(e?.message||"Could not save event.","error");}
          return;
        }

        const communityForm = event.target.closest("[data-community-form]");

        if (communityForm) {
          event.preventDefault();
          const auth = window.ApostolicAuth;
          const api = window.ApostolicSupabase;
          if (!auth || !auth.isLoggedIn() || !api || !api.isConfigured()) {
            toast("Please sign in and make sure Supabase is configured.", "error");
            return;
          }
          const data = new FormData(communityForm);
          const editId = communityForm.dataset.editId || "";
          try {
            let result;
            if (editId) {
              result = await api.update("community_posts", {
                title: String(data.get("title") || "").trim(),
                content: String(data.get("content") || "").trim()
              }, { id: editId, user_id: auth.getUser().id });
            } else {
              result = await api.insert("community_posts", {
                user_id: auth.getUser().id,
                title: String(data.get("title") || "").trim(),
                content: String(data.get("content") || "").trim(),
                is_published: true
              });
            }
            if (result && result.error) throw result.error;
            closeDynamicModal(communityForm.closest(".apostolic-modal"));
            toast(editId ? "Your post was updated." : "Your community post was published.", "success");
            renderPage("community");
          } catch (error) {
            console.error("Community post save failed:", error);
            toast(error && error.message ? error.message : "Could not save post.", "error");
          }
          return;
        }

        const authForm = event.target.closest("[data-auth-form]");

        if (authForm) {
          event.preventDefault();
          const auth = window.ApostolicAuth;
          if (!auth) {
            toast("Authentication is not available.", "error");
            return;
          }
          const formData = new FormData(authForm);
          const email = String(formData.get("email") || "").trim();
          const password = String(formData.get("password") || "");
          const name = String(formData.get("name") || "").trim();
          try {
            if (authForm.dataset.authForm === "signup") {
              await auth.signUp(email, password, { full_name: name, role: "user" });
              toast("Account created successfully.", "success");
            } else {
              await auth.signIn(email, password);
              toast("Signed in successfully.", "success");
            }
            closeDynamicModal(authForm.closest(".apostolic-modal"));
            renderPage(window.location.hash.substring(1) || "home");
          } catch (error) {
            console.error("Authentication failed:", error);
            toast(error && error.message ? error.message : "Authentication failed.", "error");
          }
          return;
        }

        const profileEdit = event.target.closest("[data-profile-form]");
        if (profileEdit) {
          event.preventDefault();
          if (!requireLogin()) return;
          const data = new FormData(profileEdit);
          try {
            const result = await window.ApostolicSupabase.update("profiles", {
              full_name: String(data.get("full_name") || "").trim()
            }, { id: currentUser().id });
            if (result?.error) throw result.error;
            toast("Profile updated successfully.", "success"); renderPage("profile");
          } catch (error) { toast(error?.message || "Could not update profile.", "error"); }
          return;
        }

        const questionForm = event.target.closest("[data-question-form]");
        if (questionForm) {
          event.preventDefault();
          const data = new FormData(questionForm);
          try {
            const result = await window.ApostolicSupabase.insert("questions", { user_id: currentUser().id, title: String(data.get("title") || "").trim(), content: String(data.get("content") || "").trim() });
            if (result?.error) throw result.error;
            closeDynamicModal(questionForm.closest(".apostolic-modal")); toast("Question posted.", "success"); renderPage("qa");
          } catch (error) { toast(error?.message || "Could not post question.", "error"); }
          return;
        }

        const answerForm = event.target.closest("[data-answer-form]");
        if (answerForm) {
          event.preventDefault();
          const data = new FormData(answerForm);
          try {
            const result = await window.ApostolicSupabase.insert("answers", { question_id: answerForm.dataset.questionId, user_id: currentUser().id, content: String(data.get("content") || "").trim() });
            if (result?.error) throw result.error;
            closeDynamicModal(answerForm.closest(".apostolic-modal")); toast("Answer posted.", "success"); renderPage("qa");
          } catch (error) { toast(error?.message || "Could not post answer.", "error"); }
          return;
        }

        const commentForm = event.target.closest("[data-comment-form]");
        if (commentForm) {
          event.preventDefault();
          const data = new FormData(commentForm);
          try {
            const result = await window.ApostolicSupabase.insert("comments", { post_id: commentForm.dataset.commentId, user_id: currentUser().id, content: String(data.get("content") || "").trim() });
            if (result?.error) throw result.error;
            closeDynamicModal(commentForm.closest(".apostolic-modal")); toast("Comment posted.", "success");
          } catch (error) { toast(error?.message || "Could not post comment.", "error"); }
          return;
        }

        const uploadForm =
          event.target.closest(
            "[data-upload-form]"
          );

        if (uploadForm) {
          event.preventDefault();

          handleUploadSubmit(
            uploadForm
          );

          return;
        }

        const localEditForm = event.target.closest("[data-local-edit-form]");
        if (localEditForm) {
          event.preventDefault();
          const items = storage.get("apostolic_created_items", []);
          const index = items.findIndex(function (item) {
            return String(item.id) === String(localEditForm.dataset.editId) &&
              String(item.type) === String(localEditForm.dataset.editType);
          });
          if (index < 0) {
            toast("Local content was not found.", "error");
            return;
          }
          const data = new FormData(localEditForm);
          items[index].title = String(data.get("title") || "").trim();
          items[index].description = String(data.get("description") || "").trim();
          storage.set("apostolic_created_items", items);
          closeDynamicModal(localEditForm.closest(".apostolic-modal"));
          toast("Content updated successfully.", "success");
          renderPage(window.location.hash.substring(1) || "home");
          return;
        }

        const mediaEditForm = event.target.closest("[data-media-edit-form]");
        if (mediaEditForm) {
          event.preventDefault();
          const api = window.ApostolicSupabase;
          const auth = window.ApostolicAuth;
          if (!api || !api.isConfigured() || !auth || !auth.isLoggedIn()) {
            toast("Please sign in and make sure Supabase is configured.", "error");
            return;
          }
          const data = new FormData(mediaEditForm);
          try {
            const result = await api.update("media_uploads", {
              title: String(data.get("title") || "").trim(),
              description: String(data.get("description") || "").trim()
            }, { id: mediaEditForm.dataset.editId });
            if (result?.error) throw result.error;
            closeDynamicModal(mediaEditForm.closest(".apostolic-modal"));
            toast("Content updated successfully.", "success");
            renderPage(window.location.hash.substring(1) || "home");
          } catch (error) {
            console.error("Media edit failed:", error);
            toast(error?.message || "Could not update content.", "error");
          }
          return;
        }

        const createForm =
          event.target.closest(
            "[data-create-form]"
          );

        if (createForm) {
          event.preventDefault();

          handleCreateSubmit(
            createForm
          );
        }
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Escape") return;

        const modal =
          $(".apostolic-modal");

        if (modal) {
          closeDynamicModal(modal);
        }
      }
    );
  }

  async function handleContentAction(element) {
    const action = element.dataset.contentAction;
    const type = element.dataset.contentType;
    const id = element.dataset.contentId;
    if (!action || !id) return;

    if (action === "read-notification") {
      if(!requireLogin()) return;
      try {
        const r=await window.ApostolicSupabase.update("notifications",{is_read:true},{id:id,user_id:currentUser().id});
        if(r?.error) throw r.error;
        toast("Notification marked as read.","success"); renderPage("notifications");
      } catch(e){toast(e?.message||"Could not update notification.","error");}
      return;
    }
    if (action === "like" || action === "save") {
      await toggleUserRelation(action === "like" ? "likes" : "saved_content", type, id, action === "like" ? "Like" : "Save");
      return;
    }
    if (action === "download") {
      if (!requireLogin()) return;
      const url = element.dataset.fileUrl;
      if (url) window.open(url, "_blank", "noopener");
      try { await window.ApostolicSupabase.insert("downloads", { user_id: currentUser().id, content_type: type, content_id: id }); } catch (error) {}
      return;
    }
    if (action === "comments") {
      if (type !== "community_post") { toast("Comments are available for community posts.", "error"); return; }
      await showComments(type, id, element.dataset.contentTitle || "Community Post");
      return;
    }
    if (action === "manage-playlist") {
      try {
        const api=window.ApostolicSupabase, user=currentUser();
        const p=await api.select("playlists","*",{eq:{id:id,user_id:user.id},limit:1});
        const playlist=p?.data?.[0]; if(!playlist){toast("Playlist not found.","error");return;}
        const [songs,links]=await Promise.all([
          api.select("media_uploads","*",{eq:{type:"song"},order:{column:"created_at",ascending:false},limit:200}),
          api.select("playlist_songs","*",{eq:{playlist_id:id},limit:200})
        ]);
        showPlaylistSongsForm(playlist,songs?.data||[],(links?.data||[]).map(x=>x.song_id));
      } catch(e){toast(e?.message||"Could not load playlist songs.","error");}
      return;
    }
    if (action === "edit-playlist") {
      try { const r=await window.ApostolicSupabase.select("playlists","*",{eq:{id:id,user_id:currentUser().id}}); const row=r?.data?.[0]; if(!row){toast("Playlist not found.","error");return;} showPlaylistForm(row); } catch(e){toast(e?.message||"Could not load playlist.","error");}
      return;
    }
    if (action === "edit-event") {
      try { const r=await window.ApostolicSupabase.select("events","*",{eq:{id:id,organizer_id:currentUser().id}}); const row=r?.data?.[0]; if(!row){toast("Event not found.","error");return;} showEventForm(row); } catch(e){toast(e?.message||"Could not load event.","error");}
      return;
    }
    if (action === "delete-event") {
      if(!requireLogin() || !window.confirm("Delete this event?")) return;
      try { const r=await window.ApostolicSupabase.remove("events",{id:id,organizer_id:currentUser().id}); if(r?.error) throw r.error; toast("Event deleted.","success"); renderPage("events"); } catch(e){toast(e?.message||"Could not delete event.","error");}
      return;
    }
    if (action === "delete-playlist") {
      if (!requireLogin()) return;
      if (!window.confirm("Delete this playlist?")) return;
      try {
        const result = await window.ApostolicSupabase.remove("playlists", { id: id, user_id: currentUser().id });
        if (result?.error) throw result.error;
        toast("Playlist deleted.", "success");
        renderPage("playlists");
      } catch (e) { toast(e?.message || "Could not delete playlist.", "error"); }
      return;
    }
    if (action === "edit-local" || action === "delete-local") {
      const items = storage.get("apostolic_created_items", []);
      const index = items.findIndex(function(item) {
        return String(item.id) === String(id) && String(item.type) === String(type);
      });
      if (index < 0) { toast("Local content was not found.", "error"); return; }
      if (action === "delete-local") {
        if (!window.confirm("Delete this content? This action cannot be undone.")) return;
        items.splice(index, 1);
        storage.set("apostolic_created_items", items);
        toast("Content deleted successfully.", "success");
        renderPage(window.location.hash.substring(1) || "home");
        return;
      }
      const item = items[index];
      createModal("Edit Content",
        '<form class="dynamic-form" data-local-edit-form data-edit-id="' + escapeHTML(item.id) + '" data-edit-type="' + escapeHTML(item.type) + '">' +
        '<div class="form-group"><label>Title</label><input name="title" type="text" value="' + escapeHTML(item.title || "") + '" required></div>' +
        '<div class="form-group"><label>Description</label><textarea name="description" rows="5">' + escapeHTML(item.description || "") + '</textarea></div>' +
        '<button type="submit" class="btn primary">Save Changes</button></form>');
      return;
    }
    if (action === "answer") { showAnswerForm(id); return; }
    if (action === "question-answers") {
      try {
        const result = await window.ApostolicSupabase.select("answers", "*", { eq: { question_id: id }, order: { column: "created_at", ascending: true } });
        const html = (result?.data || []).map(function(a) { return renderCard("💬", "Answer", a.content); }).join("") || renderCard("💬", "No Answers", "No answers yet.");
        createModal("Answers", '<section class="content-grid">' + html + '</section>');
      } catch (error) { toast("Could not load answers.", "error"); }
      return;
    }


    if (!api || !api.isConfigured()) {
      toast("Supabase is not configured.", "error");
      return;
    }

    if (action === "edit") {
      try {
        if (type === "community_post") {
          const result = await api.select("community_posts", "*", { eq: { id } });
          const post = result?.data?.[0];
          if (!post || post.user_id !== auth.getUser().id) {
            toast("You can edit only your own post.", "error");
            return;
          }
          showCommunityPostForm(post);
          return;
        }

        if (type === "media_upload") {
          const result = await api.select("media_uploads", "*", { eq: { id } });
          const item = result?.data?.[0];
          if (!item) {
            toast("Content was not found.", "error");
            return;
          }
          showEditMediaForm(item);
          return;
        }
      } catch (error) {
        console.error("Edit load failed:", error);
        toast("Could not load this content.", "error");
      }
      return;
    }

    if (action === "edit" && type === "folder") {
      try { const r=await api.select("folders","*",{eq:{id:id,created_by:auth.getUser().id}}); const row=r?.data?.[0]; if(!row){toast("Folder not found.","error");return;} showFolderForm(row); } catch(e){toast(e?.message||"Could not load folder.","error");}
      return;
    }
    if (action === "delete" && type === "folder") {
      if (!window.confirm("Delete this folder?")) return;
      try { const r=await api.remove("folders",{id:id,created_by:auth.getUser().id}); if(r?.error) throw r.error; toast("Folder deleted.","success"); renderPage("folders"); } catch(e){toast(e?.message||"Could not delete folder.","error");}
      return;
    }

    if (action === "delete") {
      if (!window.confirm("Delete this content? This action cannot be undone.")) return;
      try {
        if (type === "community_post") {
          const result = await api.remove("community_posts", { id, user_id: auth.getUser().id });
          if (result?.error) throw result.error;
        } else if (type === "media_upload") {
          const result = await api.select("media_uploads", "*", { eq: { id } });
          const item = result?.data?.[0];
          if (!item) throw new Error("Content was not found.");
          const deleted = await api.remove("media_uploads", { id });
          if (deleted?.error) throw deleted.error;
          if (item.file_path && api.removeFile) {
            const storageResult = await api.removeFile("Apostolic_Media", [item.file_path]);
            if (storageResult?.error) console.warn("Storage cleanup failed:", storageResult.error);
          }
        } else {
          return;
        }
        toast("Content deleted successfully.", "success");
        renderPage(window.location.hash.substring(1) || "home");
      } catch (error) {
        console.error("Delete failed:", error);
        toast(error?.message || "Could not delete content.", "error");
      }
    }
  }

  function showEditMediaForm(item) {
    createModal(
      "Edit Content",
      '<form class="dynamic-form" data-media-edit-form data-edit-id="' + escapeHTML(item.id) + '">' +
        '<div class="form-group"><label>Title</label><input name="title" type="text" value="' + escapeHTML(item.title || '') + '" required></div>' +
        '<div class="form-group"><label>Description</label><textarea name="description" rows="5">' + escapeHTML(item.description || '') + '</textarea></div>' +
        '<button type="submit" class="btn primary">Save Changes</button>' +
      '</form>'
    );
  }

  function handlePageAction(
    action
  ) {
    switch (action) {

      case "ask-question":
        showQuestionForm();
        break;

      case "create-post":
        requireCreatorAuth(function () {
          showCommunityPostForm();
        });
        break;

      case "sign-in":
        showAuthForm("login");
        break;

      case "sign-up":
        showAuthForm("signup");
        break;

      case "sign-out":
        if (window.ApostolicAuth?.signOut) {
          window.ApostolicAuth.signOut().then(function(){ toast("Signed out successfully.","success"); renderPage("home"); });
        }
        break;

      case "create-teaching":
        requireCreatorAuth(function () {
        showCreateForm(
          "Create Teaching",
          "teaching"
        );

        });
        break;

      case "create-sermon":
        requireCreatorAuth(function () {
        showCreateForm(
          "Create Sermon",
          "sermon"
        );

        });
        break;

      case "create-song":
        requireCreatorAuth(function () {
        showCreateForm(
          "Create Song",
          "song"
        );

        });
        break;

      case "create-lyric":
        requireCreatorAuth(function () {
        showCreateForm(
          "Create Lyrics",
          "lyric"
        );

        });
        break;

      case "create-course":
        requireCreatorAuth(function () {
        showCreateForm(
          "Create Course",
          "course"
        );

        });
        break;

      case "create-event":
        requireCreatorAuth(function () { showEventForm(); });
        break;

      case "create-playlist":
        requireCreatorAuth(function () { showPlaylistForm(); });
        break;

      case "upload-teaching":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Teaching",
          "teaching"
        );

        });
        break;

      case "upload-sermon":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Sermon",
          "sermon"
        );

        });
        break;

      case "upload-song":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Song",
          "song"
        );

        });
        break;

      case "upload-video":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Video",
          "video"
        );

        });
        break;

      case "upload-bible":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Bible Resource",
          "bible"
        );

        });
        break;

      case "upload-course":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Course Material",
          "course"
        );

        });
        break;

      case "upload-document":
        requireCreatorAuth(function () {
        showUploadForm(
          "Upload Document",
          "document"
        );

        });
        break;

      default:
        toast(
          "This feature is not available yet.",
          "info"
        );
    }
  }

  /* =========================================================
     UPLOAD
     ========================================================= */

  async function handleUploadSubmit(
    form
  ) {
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

    const file =
      formData.get("file");

    const type =
      form.dataset.uploadForm ||
      "document";

    const statusElement =
      form.querySelector(".upload-status");

    function setUploadStatus(
      message,
      status = "info"
    ) {
      if (!statusElement) return;

      statusElement.textContent =
        message || "";

      statusElement.dataset.status =
        status;

      statusElement.hidden =
        !message;
    }

    const auth = window.ApostolicAuth;
    const currentAuthUser = auth && auth.getUser ? auth.getUser() : null;
    if (!auth || !auth.isLoggedIn() || !currentAuthUser) {
      setUploadStatus("Please sign in before uploading content.", "error");
      toast("Please sign in before uploading content.", "error");
      return;
    }

    if (!title) {
      setUploadStatus(
        "Please enter a title.",
        "error"
      );
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
      setUploadStatus(
        "Please select a file.",
        "error"
      );
      toast(
        "Please select a file.",
        "error"
      );
      return;
    }

    const submitButton =
      form.querySelector(
        "[data-upload-submit]"
      );

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent =
        "Uploading...";
    }

    setUploadStatus(
      "Preparing upload...",
      "info"
    );

    try {
      const api =
        window.ApostolicSupabase;

      const config =
        window.ApostolicConfig ||
        window.APP_CONFIG || {};

      const bucketName =
        (config.UPLOADS &&
          config.UPLOADS.BUCKET) ||
        "Apostolic_Media";

      if (!api || !api.isConfigured()) {
        throw new Error(
          "Supabase is not configured. Please check js/config.js."
        );
      }

      const safeName =
        file.name
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
          )
          .replace(
            /_+/g,
            "_"
          );

      const path =
        `${type}/${Date.now()}-${safeName}`;

      setUploadStatus(
        "Uploading file to Supabase Storage...",
        "info"
      );

      const uploadPromise =
        api.uploadFile(
          bucketName,
          path,
          file,
          {
            upsert: false
          }
        );

      const uploadResult =
        await Promise.race([
          uploadPromise,
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Upload timed out after 60 seconds. Please check your internet connection and Supabase Storage policy."
                  )
                ),
              60000
            )
          )
        ]);

      if (
        !uploadResult ||
        uploadResult.error
      ) {
        throw (
          uploadResult &&
          uploadResult.error
        ) || new Error(
          "Supabase Storage upload failed."
        );
      }

      setUploadStatus(
        "File uploaded. Saving file information...",
        "info"
      );

      const fileUrl =
        api.getPublicUrl(
          bucketName,
          path
        );

      if (!fileUrl) {
        throw new Error(
          "The file uploaded, but its public URL could not be created."
        );
      }

      const dbResult =
        await api.insert(
          "media_uploads",
          {
            title,
            description,
            type,
            user_id: currentAuthUser.id,
            file_name: file.name,
            file_path: path,
            file_url: fileUrl,
            file_size: file.size,
            file_type:
              file.type || null
          }
        );

      if (
        !dbResult ||
        dbResult.error
      ) {
        throw (
          dbResult &&
          dbResult.error
        ) || new Error(
          "The file uploaded, but its database record could not be saved."
        );
      }

      setUploadStatus(
        "Upload completed successfully.",
        "success"
      );

      closeDynamicModal(
        form.closest(
          ".apostolic-modal"
        )
      );

      toast(
        `"${title}" uploaded successfully to Apostolic Media.`,
        "success"
      );

      refreshCurrentMediaPage();

    } catch (error) {
      console.error(
        "Supabase upload failed:",
        error
      );

      const message =
        error && error.message
          ? error.message
          : "Unknown upload error.";

      setUploadStatus(
        `Upload failed: ${message}`,
        "error"
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          "Upload";
      }

      toast(
        `Upload failed: ${message}`,
        "error"
      );
    }
  }

  /* =========================================================
     CREATE
     ========================================================= */

  async function handleCreateSubmit(
    form
  ) {
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

    const createdItem = {
      id: Date.now().toString(),
      title,
      description,
      language: selectedLanguage,
      type,
      createdAt:
        new Date().toISOString()
    };

    let savedOnline = false;

    try {
      const api = window.ApostolicSupabase;

      if (api && api.isConfigured()) {
        const result = await api.insert(
          "media_uploads",
          {
            title,
            description,
            type,
            user_id: window.ApostolicAuth?.getUser?.()?.id || null,
            file_name: "",
            file_path: "",
            file_url: "",
            file_size: 0,
            file_type: "created"
          }
        );

        if (result && !result.error) {
          savedOnline = true;
        } else if (result && result.error) {
          console.error("Online create failed:", result.error);
        }
      }
    } catch (error) {
      console.warn(
        "Online create failed; keeping a local copy:",
        error
      );
    }

    const items =
      storage.get(
        "apostolic_created_items",
        []
      );

    items.push(createdItem);

    storage.set(
      "apostolic_created_items",
      items
    );

    closeDynamicModal(
      form.closest(
        ".apostolic-modal"
      )
    );

    toast(
      savedOnline
        ? `"${title}" created and saved to Media.`
        : `"${title}" created locally because online saving failed.`,
      savedOnline ? "success" : "error"
    );

    if (savedOnline) {
      refreshCurrentMediaPage();
    }
  }
     /* =========================================================
     BACK TO TOP
     ========================================================= */

  function initBackToTop() {
    const button =
      $("[data-action='back-to-top']") ||
      $(".back-to-top");

    if (!button) return;

    window.addEventListener(
      "scroll",
      function () {
        button.classList.toggle(
          "show",
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

  /* =========================================================
     CONNECTION STATUS
     ========================================================= */

  function initConnectionStatus() {
    function update() {
      document.body.classList.toggle(
        "offline",
        !navigator.onLine
      );

      document.body.classList.toggle(
        "online",
        navigator.onLine
      );
    }

    window.addEventListener(
      "online",
      update
    );

    window.addEventListener(
      "offline",
      update
    );

    update();
  }

  /* =========================================================
     KEYBOARD SHORTCUTS
     ========================================================= */

  function initKeyboardShortcuts() {
    document.addEventListener(
      "keydown",
      function (event) {

        const isSearchShortcut =
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() === "k";

        if (isSearchShortcut) {
          event.preventDefault();

          const search =
            $("#globalSearch") ||
            $('input[type="search"]');

          if (search) {
            search.focus();
          }

          return;
        }

        if (
          event.key === "/" &&
          !["INPUT", "TEXTAREA", "SELECT"]
            .includes(
              document.activeElement.tagName
            )
        ) {
          event.preventDefault();

          const search =
            $("#globalSearch") ||
            $('input[type="search"]');

          if (search) {
            search.focus();
          }
        }
      }
    );
  }

  /* =========================================================
     VISIBILITY
     ========================================================= */

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

  /* =========================================================
     ERROR HANDLING
     ========================================================= */

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
          "Apostolic Media promise error:",
          event.reason
        );
      }
    );
  }

  /* =========================================================
     SERVICE WORKER
     ========================================================= */

  function initServiceWorker() {
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
          .catch(function (error) {
            console.warn(
              "Service worker registration failed:",
              error
            );
          });
      }
    );
  }

  /* =========================================================
     PAGE HELPERS
     ========================================================= */

  function renderPageHero(
    title,
    subtitle,
    actions = ""
  ) {
    return `
      <section class="page-hero">

        <div>
          <h1>
            ${escapeHTML(title)}
          </h1>

          <p>
            ${escapeHTML(subtitle)}
          </p>
        </div>

        ${
          actions
            ? `<div class="page-actions">
                 ${actions}
               </div>`
            : ""
        }

      </section>
    `;
  }

  function renderCard(
    icon,
    title,
    description,
    action = ""
  ) {
    return `
      <article class="card">

        <div class="card-icon">
          ${icon}
        </div>

        <h3>
          ${escapeHTML(title)}
        </h3>

        <p>
          ${escapeHTML(description)}
        </p>

        ${
          action
            ? `<div class="card-actions">
                 ${action}
               </div>`
            : ""
        }

      </article>
    `;
  }

  function renderAction(
    label,
    action
  ) {
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

  /* =========================================================
     SOCIAL / USER FEATURES
     ========================================================= */

  function currentUser() {
    const auth = window.ApostolicAuth;
    return auth && auth.getUser ? auth.getUser() : null;
  }

  function requireLogin() {
    if (!currentUser()) {
      toast("Please sign in first.", "error");
      showAuthForm("login");
      return false;
    }
    return true;
  }

  async function toggleUserRelation(table, contentType, contentId, label) {
    if (!requireLogin()) return;
    const api = window.ApostolicSupabase;
    const user = currentUser();
    if (!api || !api.isConfigured()) { toast("Supabase is not configured.", "error"); return; }
    try {
      const existing = await api.select(table, "*", { eq: { user_id: user.id, content_type: contentType, content_id: contentId } });
      if (existing?.data?.length) {
        const result = await api.remove(table, { user_id: user.id, content_type: contentType, content_id: contentId });
        if (result?.error) throw result.error;
        toast(label + " removed.", "success");
      } else {
        const result = await api.insert(table, { user_id: user.id, content_type: contentType, content_id: contentId });
        if (result?.error) throw result.error;
        toast(label + " saved.", "success");
      }
      renderPage(window.location.hash.substring(1) || "home");
    } catch (error) { toast(error?.message || "Could not update " + label.toLowerCase() + ".", "error"); }
  }

  function renderEngagementActions(contentType, contentId, fileUrl = "") {
    const id = escapeHTML(contentId), type = escapeHTML(contentType);
    const download = fileUrl ? '<button type="button" class="btn" data-content-action="download" data-content-type="' + type + '" data-content-id="' + id + '" data-file-url="' + escapeHTML(fileUrl) + '">Download</button>' : "";
    return '<div class="card-actions">' +
      '<button type="button" class="btn" data-content-action="like" data-content-type="' + type + '" data-content-id="' + id + '">Like</button>' +
      '<button type="button" class="btn" data-content-action="save" data-content-type="' + type + '" data-content-id="' + id + '">Save</button>' + download + '</div>';
  }

  async function showComments(contentType, contentId, title) {
    const api = window.ApostolicSupabase;
    if (!api || !api.isConfigured()) { toast("Supabase is not configured.", "error"); return; }
    try {
      const result = await api.select("comments", "*", { eq: { post_id: contentId }, order: { column: "created_at", ascending: true }, limit: 100 });
      const comments = result?.data || [];
      const list = comments.length ? comments.map(function (item) {
        return renderCard("💬", "Comment", item.content, "");
      }).join("") : renderCard("💬", "No Comments", "Be the first to comment.");
      const form = currentUser() ? '<form class="dynamic-form" data-comment-form data-comment-id="' + escapeHTML(contentId) + '"><textarea name="content" rows="3" required placeholder="Write a comment..."></textarea><button type="submit" class="btn primary">Comment</button></form>' : '<p>Please sign in to comment.</p>';
      createModal("Comments: " + title, '<section class="content-grid">' + list + '</section>' + form);
    } catch (error) { toast("Could not load comments.", "error"); }
  }

  async function loadSavedContent() {
    const container = $(".page-container"), user = currentUser(), api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const saved = await api.select("saved_content", "*", { eq: { user_id: user.id }, order: { column: "created_at", ascending: false }, limit: 100 });
      const cards = [];
      for (const row of (saved?.data || [])) {
        const table = row.content_type === "community_post" ? "community_posts" : "media_uploads";
        const q = await api.select(table, "*", { eq: { id: row.content_id } });
        const item = q?.data?.[0];
        if (item) cards.push(renderCard("🔖", item.title || "Saved Content", item.description || item.content || "", renderEngagementActions(row.content_type, row.content_id, item.file_url || "")));
      }
      container.insertAdjacentHTML("beforeend", '<section class="content-grid">' + (cards.join("") || renderCard("🔖", "No Saved Content", "Content you save will appear here.")) + '</section>');
    } catch (error) { console.error("Saved content failed:", error); }
  }

  async function loadNotifications() {
    const container = $(".page-container"), user = currentUser(), api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("notifications", "*", { eq: { user_id: user.id }, order: { column: "created_at", ascending: false }, limit: 100 });
      const html = (result?.data || []).map(function(n) {
        const readButton = n.is_read ? "" : '<button type="button" class="btn" data-content-action="read-notification" data-content-id="' + escapeHTML(n.id) + '">Mark as read</button>';
        const open = n.link ? '<a class="btn" href="' + escapeHTML(n.link) + '">Open</a>' : "";
        return renderCard(n.is_read ? "🔔" : "🟢", n.title, n.message, open + readButton);
      }).join("");
      container.insertAdjacentHTML("beforeend", '<section class="content-grid">' + (html || renderCard("🔔", "No Notifications", "You are all caught up.")) + '</section>');
    } catch (error) { console.error("Notifications failed:", error); }
  }

  async function loadProfilePage() {
    const container = $(".page-container"), user = currentUser(), api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("profiles", "*", { eq: { id: user.id } });
      const profile = result?.data?.[0] || {};
      container.insertAdjacentHTML("beforeend", '<section class="content-grid"><article class="card"><h3>Profile</h3><p>' + escapeHTML(profile.full_name || user.email || "User") + '</p><p>' + escapeHTML(user.email || "") + '</p><p>Role: ' + escapeHTML(profile.role || "user") + '</p><button type="button" class="btn" data-page-action="sign-out">Sign Out</button></article><article class="card"><h3>Edit Profile</h3><form class="dynamic-form" data-profile-form><input name="full_name" value="' + escapeHTML(profile.full_name || "") + '" placeholder="Full name"><button type="submit" class="btn primary">Save Profile</button></form></article></section>');
    } catch (error) { console.error("Profile failed:", error); }
  }

  async function loadQA() {
    const container = $(".page-container"), api = window.ApostolicSupabase;
    if (!container || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("questions", "*", { order: { column: "created_at", ascending: false }, limit: 50 });
      const html = (result?.data || []).map(function(q) {
        return renderCard("❓", q.title, q.content, '<button type="button" class="btn" data-content-action="answer" data-content-id="' + escapeHTML(q.id) + '"><b>Answer</b></button><button type="button" class="btn" data-content-action="question-answers" data-content-id="' + escapeHTML(q.id) + '">View Answers</button>');
      }).join("");
      container.insertAdjacentHTML("beforeend", '<section class="content-grid">' + (html || renderCard("❓", "No Questions Yet", "Ask a question and let the community help.")) + '</section>');
    } catch (error) { console.error("Q&A failed:", error); }
  }

  function showQuestionForm() {
    if (!requireLogin()) return;
    createModal("Ask a Question", '<form class="dynamic-form" data-question-form><input name="title" required placeholder="Question title"><textarea name="content" rows="6" required placeholder="Describe your question"></textarea><button type="submit" class="btn primary">Ask Question</button></form>');
  }

  function showAnswerForm(questionId) {
    if (!requireLogin()) return;
    createModal("Answer Question", '<form class="dynamic-form" data-answer-form data-question-id="' + escapeHTML(questionId) + '"><textarea name="content" rows="6" required placeholder="Write your answer"></textarea><button type="submit" class="btn primary">Post Answer</button></form>');
  }

  /* =========================================================
     PAGES
     ========================================================= */

  const pages = {

    /* -------------------------------------------------------
       HOME
       ------------------------------------------------------- */

    home: {
      title: "Home",

      content: `
        ${renderPageHero(
          "Welcome to Apostolic Media",
          "A place for Bible study, Christian teachings, worship, sermons and community."
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Bible",
            "Read and explore the Word of God.",
            `<a class="btn" href="#bible">Open Bible</a>`
          )}

          ${renderCard(
            "🎓",
            "Teachings",
            "Christian teachings and Bible studies.",
            `<a class="btn" href="#teachings">Explore Teachings</a>`
          )}

          ${renderCard(
            "🎙️",
            "Sermons",
            "Listen to Christian sermons and messages.",
            `<a class="btn" href="#sermons">View Sermons</a>`
          )}

          ${renderCard(
            "🎵",
            "Songs",
            "Discover worship songs and Christian music.",
            `<a class="btn" href="#songs">Browse Songs</a>`
          )}

          ${renderCard(
            "🎬",
            "Videos",
            "Watch Christian videos and media.",
            `<a class="btn" href="#videos">Watch Videos</a>`
          )}

          ${renderCard(
            "👥",
            "Community",
            "Connect with the Apostolic Christian community.",
            `<a class="btn" href="#community">Join Community</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       BIBLE
       ------------------------------------------------------- */

    bible: {
      title: "Bible",

      content: `
        ${renderPageHero(
          "Bible",
          "Explore the Holy Scriptures."
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Read Bible",
            "Read Scripture and continue your Bible journey."
          )}

          ${renderCard(
            "🔎",
            "Bible Search",
            "Search for books, chapters and verses."
          )}

          ${renderCard(
            "⭐",
            "Saved Verses",
            "Keep verses that are meaningful to you.",
            `<a class="btn" href="#saved">Saved</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       BIBLE STUDY
       ------------------------------------------------------- */

    "bible-study": {
      title: "Bible Study",

      content: `
        ${renderPageHero(
          "Bible Study",
          "Grow deeper in the Word through structured study."
        )}

        <section class="content-grid">

          ${renderCard(
            "📚",
            "Christian Written Teachings",
            "Read original Christian articles, teachings, Bible studies, and other written materials."
          )}

          ${renderCard(
            "📝",
            "Study Notes",
            "Create and organize your personal Bible study notes."
          )}

          ${renderCard(
            "🎓",
            "Courses",
            "Explore structured Christian learning.",
            `<a class="btn" href="#courses">View Courses</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       TEACHINGS
       ------------------------------------------------------- */

    teachings: {
      title: "Teachings",

      content: `
        ${renderPageHero(
          "Teachings",
          "Christian teachings, Bible lessons and written resources.",
          renderAction(
            "Create Teaching",
            "create-teaching"
          ) +
          renderAction(
            "Upload Teaching",
            "upload-teaching"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📖",
            "Bible Teaching",
            "Learn biblical principles and Christian doctrine."
          )}

          ${renderCard(
            "✍️",
            "Written Teachings",
            "Read Christian articles and study materials."
          )}

          ${renderCard(
            "🎓",
            "Learning",
            "Continue your Christian learning journey."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SERMONS
       ------------------------------------------------------- */

    sermons: {
      title: "Sermons",

      content: `
        ${renderPageHero(
          "Sermons",
          "Listen to Christian sermons and messages.",
          renderAction(
            "Upload Sermon",
            "upload-sermon"
          ) +
          renderAction(
            "Create Sermon",
            "create-sermon"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎙️",
            "Recent Sermons",
            "Listen to recent Christian messages."
          )}

          ${renderCard(
            "🔥",
            "Featured Messages",
            "Messages selected for encouragement and spiritual growth."
          )}

          ${renderCard(
            "📚",
            "Sermon Library",
            "Browse the sermon collection."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SONGS
       ------------------------------------------------------- */

    songs: {
      title: "Songs",

      content: `
        ${renderPageHero(
          "Songs",
          "Christian worship songs and music.",
          renderAction(
            "Upload Song",
            "upload-song"
          ) +
          renderAction(
            "Create Song",
            "create-song"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎵",
            "Worship Songs",
            "Discover Christian worship music."
          )}

          ${renderCard(
            "🎤",
            "Artists",
            "Explore Christian artists.",
            `<a class="btn" href="#artists">Artists</a>`
          )}

          ${renderCard(
            "📜",
            "Lyrics",
            "Read lyrics for Christian songs.",
            `<a class="btn" href="#lyrics">Lyrics</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       LYRICS
       ------------------------------------------------------- */

    lyrics: {
      title: "Lyrics",

      content: `
        ${renderPageHero(
          "Lyrics",
          "Read Christian song lyrics.",
          renderAction(
            "Create Lyrics",
            "create-lyric"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📜",
            "Song Lyrics",
            "Browse available Christian lyrics."
          )}

          ${renderCard(
            "🔎",
            "Search Lyrics",
            "Find lyrics by song or artist."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       VIDEOS
       ------------------------------------------------------- */

    videos: {
      title: "Videos",

      content: `
        ${renderPageHero(
          "Videos",
          "Watch Christian videos, teachings and sermons.",
          renderAction(
            "Upload Video",
            "upload-video"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "▶️",
            "Christian Videos",
            "Watch Christian media."
          )}

          ${renderCard(
            "🎙️",
            "Video Sermons",
            "Watch sermons and messages."
          )}

          ${renderCard(
            "📚",
            "Bible Lessons",
            "Learn through Christian video lessons."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       LIVE
       ------------------------------------------------------- */

    live: {
      title: "Live",

      content: `
        ${renderPageHero(
          "Live",
          "Watch live Christian programs and events."
        )}

        <section class="content-grid">

          ${renderCard(
            "🔴",
            "Live Now",
            "Live broadcasts will appear here."
          )}

          ${renderCard(
            "📅",
            "Upcoming",
            "See upcoming live Christian programs."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       COMMUNITY
       ------------------------------------------------------- */

    community: {
      title: "Community",

      content: `
        ${renderPageHero(
          "Community",
          "Connect, encourage one another and grow together."
        )}

        <section class="content-grid">

          ${renderCard(
            "👥",
            "Christian Community",
            "Connect with other believers."
          )}

          ${renderCard(
            "💬",
            "Discussions",
            "Share thoughts and Christian encouragement."
          )}

          ${renderCard(
            "🙏",
            "Prayer",
            "Encourage one another through prayer."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       Q&A
       ------------------------------------------------------- */

    qa: {
      title: "Bible Q&A",

      content: `
        ${renderPageHero(
          "Bible Q&A",
          "Ask questions and explore biblical answers."
        )}

        <section class="content-grid">

          ${renderCard(
            "❓",
            "Ask a Question",
            "Submit a Bible-related question."
          )}

          ${renderCard(
            "📖",
            "Answers",
            "Explore answers to common Bible questions."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       EVENTS
       ------------------------------------------------------- */

    events: {
      title: "Events",

      content: `
        ${renderPageHero(
          "Events",
          "Christian events, meetings and programs.",
          renderAction(
            "Create Event",
            "create-event"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "📅",
            "Upcoming Events",
            "See upcoming Christian events."
          )}

          ${renderCard(
            "⛪",
            "Church Programs",
            "Discover Christian programs and gatherings."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       PLAYLISTS
       ------------------------------------------------------- */

    playlists: {
      title: "Playlists",

      content: `
        ${renderPageHero(
          "Playlists",
          "Create and organize your favorite Christian media.",
          renderAction(
            "Create Playlist",
            "create-playlist"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "☷",
            "My Playlists",
            "Your personal playlists will appear here."
          )}

          ${renderCard(
            "🎵",
            "Worship Playlist",
            "Organize worship songs for listening."
          )}

          ${renderCard(
            "🎙️",
            "Sermon Playlist",
            "Keep your favorite sermons together."
          )}

        </section>
      `
    },
         /* -------------------------------------------------------
       ARTISTS
       ------------------------------------------------------- */

    artists: {
      title: "Artists",

      content: `
        ${renderPageHero(
          "Artists",
          "Discover Christian worship artists and musicians."
        )}

        <section class="content-grid">

          ${renderCard(
            "🎤",
            "Christian Artists",
            "Explore artists and worship musicians."
          )}

          ${renderCard(
            "🎵",
            "Music",
            "Listen to songs from Christian artists."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       COURSES
       ------------------------------------------------------- */

    courses: {
      title: "Courses",

      content: `
        ${renderPageHero(
          "Courses",
          "Learn through structured Christian courses.",
          renderAction(
            "Create Course",
            "create-course"
          ) +
          renderAction(
            "Upload Course",
            "upload-course"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "🎓",
            "Bible Courses",
            "Explore structured Bible and Christian courses."
          )}

          ${renderCard(
            "📚",
            "Learning Materials",
            "Study Christian learning materials."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       PROFILE
       ------------------------------------------------------- */

    profile: {
      title: "Profile",

      content: `
        ${renderPageHero(
          "Profile",
          "Manage your Apostolic Media profile."
        )}

        <section class="content-grid">

          ${renderCard(
            "👤",
            "My Profile",
            "View and manage your profile information.",
            `<button class="btn" type="button" data-page-action="sign-in">Sign In / Create Account</button>`
          )}

          ${renderCard(
            "♡",
            "Saved",
            "Access your saved Christian content.",
            `<a class="btn" href="#saved">Open Saved</a>`
          )}

          ${renderCard(
            "⇩",
            "Downloads",
            "Access your downloaded content.",
            `<a class="btn" href="#downloads">Downloads</a>`
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       NOTIFICATIONS
       ------------------------------------------------------- */

    notifications: {
      title: "Notifications",

      content: `
        ${renderPageHero(
          "Notifications",
          "Stay informed about new Christian content and activity."
        )}

        <section class="content-grid">

          ${renderCard(
            "♧",
            "Recent Notifications",
            "Your recent notifications will appear here."
          )}

          ${renderCard(
            "🔔",
            "Updates",
            "Receive important updates from Apostolic Media."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       DOWNLOADS
       ------------------------------------------------------- */

    downloads: {
      title: "Downloads",

      content: `
        ${renderPageHero(
          "Downloads",
          "Access content you have downloaded."
        )}

        <section class="content-grid">

          ${renderCard(
            "⇩",
            "Downloaded Content",
            "Your downloaded songs, videos and documents will appear here."
          )}

          ${renderCard(
            "📁",
            "Files",
            "Manage your downloaded Christian resources."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SAVED
       ------------------------------------------------------- */

    saved: {
      title: "Saved",

      content: `
        ${renderPageHero(
          "Saved",
          "Keep your favorite Christian content in one place."
        )}

        <section class="content-grid">

          ${renderCard(
            "♡",
            "Saved Content",
            "Your saved content will appear here."
          )}

          ${renderCard(
            "📖",
            "Saved Bible Verses",
            "Keep important Bible verses for later."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       CREATOR STUDIO
       ------------------------------------------------------- */

    creator: {
      title: "Creator Studio",

      content: `
        ${renderPageHero(
          "Creator Studio",
          "Create and manage Christian media content.",
          renderAction(
            "Upload Document",
            "upload-document"
          ) +
          renderAction(
            "Create Teaching",
            "create-teaching"
          )
        )}

        <section class="content-grid">

          ${renderCard(
            "◈",
            "Content",
            "Manage your Christian content."
          )}

          ${renderCard(
            "📊",
            "Creator Dashboard",
            "Monitor your content activity."
          )}

          ${renderCard(
            "📤",
            "Uploads",
            "Upload new Christian media."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       WALLET
       ------------------------------------------------------- */

    wallet: {
      title: "Wallet",

      content: `
        ${renderPageHero(
          "Wallet",
          "Manage your support and creator transactions."
        )}

        <section class="content-grid">

          ${renderCard(
            "◇",
            "Wallet Balance",
            "Your wallet balance will appear here."
          )}

          ${renderCard(
            "💳",
            "Transactions",
            "View your transaction history."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       ADMIN
       ------------------------------------------------------- */

    admin: {
      title: "Admin",

      content: `
        ${renderPageHero(
          "Admin",
          "Manage the Apostolic Media platform."
        )}

        <section class="content-grid">

          ${renderCard(
            "⚙️",
            "Platform Management",
            "Manage platform settings and content."
          )}

          ${renderCard(
            "👥",
            "Users",
            "Manage platform users."
          )}

          ${renderCard(
            "📊",
            "Analytics",
            "View platform activity and statistics."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       SETTINGS
       ------------------------------------------------------- */

    settings: {
      title: "Settings",

      content: `
        ${renderPageHero(
          "Settings",
          "Customize your Apostolic Media experience."
        )}

        <section class="content-grid">

          ${renderCard(
            "◐",
            "Theme",
            "Change between light, dark and system themes."
          )}

          ${renderCard(
            "文",
            "Language",
            "Choose your preferred language."
          )}

          ${renderCard(
            "🔔",
            "Notifications",
            "Manage notification preferences."
          )}

        </section>
      `
    },

    /* -------------------------------------------------------
       ABOUT
       ------------------------------------------------------- */

    about: {
      title: "About",

      content: `
        ${renderPageHero(
          "About Apostolic Media",
          "A Christian digital platform for Bible, worship, teachings, sermons and community."
        )}

        <section class="content-grid">

          ${renderCard(
            "🕎",
            "Apostolic Media",
            "የኢየሱስ ልጆች Apostolic Media"
          )}

          ${renderCard(
            "📖",
            "Our Purpose",
            "To make Christian resources easier to discover, study and share."
          )}

          ${renderCard(
            "❤️",
            "Our Mission",
            "To encourage people to grow in the Word of God and connect with the Christian community."
          )}

        </section>
      `
    }

  };

  /* =========================================================
     MEDIA CONTENT LOADER
     ========================================================= */

  const mediaRouteTypes = {
    teachings: ["teaching"],
    sermons: ["sermon"],
    songs: ["song"],
    videos: ["video"],
    lyrics: ["lyric"],
    "bible-study": ["bible"],
    courses: ["course"],
    events: ["event"],
    playlists: ["playlist"],
    creator: ["document", "teaching", "sermon", "song", "video", "lyric", "bible", "course"]
  };

  function showFolderForm(folder = null) {
    const editing = !!folder;
    return createModal(editing ? "Edit Folder" : "Create Folder",
      '<form class="dynamic-form" data-folder-form' + (editing ? ' data-edit-id="' + escapeHTML(folder.id) + '"' : '') + '>' +
      '<div class="form-group"><label>Folder name</label><input name="name" required value="' + escapeHTML(folder?.name || "") + '"></div>' +
      '<div class="form-group"><label>Description</label><textarea name="description" rows="4">' + escapeHTML(folder?.description || "") + '</textarea></div>' +
      '<button type="submit" class="btn primary">' + (editing ? "Save Changes" : "Create Folder") + '</button></form>');
  }

  function showPlaylistForm(playlist = null) {
    const editing = !!playlist;
    return createModal(editing ? "Edit Playlist" : "Create Playlist",
      '<form class="dynamic-form" data-playlist-form' + (editing ? ' data-edit-id="' + escapeHTML(playlist.id) + '"' : '') + '>' +
      '<div class="form-group"><label>Playlist name</label><input name="name" required value="' + escapeHTML(playlist?.name || "") + '"></div>' +
      '<div class="form-group"><label>Description</label><textarea name="description" rows="4">' + escapeHTML(playlist?.description || "") + '</textarea></div>' +
      '<label><input type="checkbox" name="is_public" ' + (playlist?.is_public ? 'checked' : '') + '> Public playlist</label>' +
      '<button type="submit" class="btn primary">' + (editing ? "Save Changes" : "Create Playlist") + '</button></form>');
  }

  function showEventForm(item = null) {
    const editing = !!item;
    const start = item?.starts_at ? new Date(item.starts_at).toISOString().slice(0,16) : "";
    const end = item?.ends_at ? new Date(item.ends_at).toISOString().slice(0,16) : "";
    return createModal(editing ? "Edit Event" : "Create Event",
      '<form class="dynamic-form" data-event-form' + (editing ? ' data-edit-id="' + escapeHTML(item.id) + '"' : '') + '>' +
      '<div class="form-group"><label>Event title</label><input name="title" required value="' + escapeHTML(item?.title || "") + '"></div>' +
      '<div class="form-group"><label>Description</label><textarea name="description" rows="4">' + escapeHTML(item?.description || "") + '</textarea></div>' +
      '<div class="form-group"><label>Location</label><input name="location" value="' + escapeHTML(item?.location || "") + '"></div>' +
      '<div class="form-group"><label>Event URL</label><input name="event_url" type="url" value="' + escapeHTML(item?.event_url || "") + '"></div>' +
      '<div class="form-group"><label>Starts</label><input name="starts_at" type="datetime-local" required value="' + escapeHTML(start) + '"></div>' +
      '<div class="form-group"><label>Ends</label><input name="ends_at" type="datetime-local" value="' + escapeHTML(end) + '"></div>' +
      '<button type="submit" class="btn primary">' + (editing ? "Save Changes" : "Create Event") + '</button></form>');
  }

  async function loadFoldersPage() {
    const container=$(".page-container"), api=window.ApostolicSupabase;
    if(!container || !api || !api.isConfigured()) return;
    try {
      const result=await api.select("folders","*",{order:{column:"created_at",ascending:false},limit:100});
      const rows=result?.data||[];
      const cards=rows.map(function(row){
        return renderCard("📁",row.name||"Folder",row.description||"Christian resource folder.",
          contentActionButtons("folder",row.id,row.created_by));
      }).join("");
      container.insertAdjacentHTML("beforeend",'<section class="content-grid">'+
        (cards||renderCard("📁","No Folders Yet","Create your first resource folder."))+'</section>');
    } catch(e){console.error("Folders load failed:",e);}
  }

  async function loadPlaylistsPage() {
    const container=$(".page-container"), api=window.ApostolicSupabase, user=currentUser();
    if(!container || !api || !api.isConfigured() || !user) return;
    try {
      const result=await api.select("playlists","*",{eq:{user_id:user.id},order:{column:"created_at",ascending:false},limit:100});
      const rows=result?.data||[], cards=[];
      const songsResult=await api.select("media_uploads","*",{eq:{type:"song"},order:{column:"created_at",ascending:false},limit:200});
      const songMap=Object.fromEntries((songsResult?.data||[]).map(s=>[s.id,s]));
      for(const row of rows){
        const links=await api.select("playlist_songs","*",{eq:{playlist_id:row.id},order:{column:"position",ascending:true},limit:100});
        const songText=(links?.data||[]).map(x=>escapeHTML(songMap[x.song_id]?.title||"Song")).join(" • ") || "No songs added yet.";
        const actions='<button type="button" class="btn" data-content-action="manage-playlist" data-content-id="'+escapeHTML(row.id)+'">Manage Songs</button>'+
          '<button type="button" class="btn" data-content-action="edit-playlist" data-content-id="'+escapeHTML(row.id)+'">Edit</button>'+
          '<button type="button" class="btn" data-content-action="delete-playlist" data-content-id="'+escapeHTML(row.id)+'">Delete</button>';
        cards.push(renderCard("🎵",row.name||"Playlist",(row.description?escapeHTML(row.description)+"<br>":"")+songText,actions));
      }
      container.insertAdjacentHTML("beforeend",'<section class="content-grid">'+(cards.join("")||renderCard("🎵","No Playlists Yet","Create your first playlist."))+'</section>');
    } catch(e){console.error("Playlists load failed:",e);}
  }

  function showPlaylistSongsForm(playlist, songs, selectedIds) {
    const selected=new Set(selectedIds||[]);
    const checks=(songs||[]).map(function(song){
      return '<label style="display:block;margin:.45rem 0"><input type="checkbox" name="song_ids" value="'+escapeHTML(song.id)+'" '+(selected.has(song.id)?"checked":"")+'> '+escapeHTML(song.title||song.file_name||"Song")+'</label>';
    }).join("");
    return createModal("Manage Playlist Songs",
      '<form class="dynamic-form" data-playlist-songs-form data-playlist-id="'+escapeHTML(playlist.id)+'"><p>Select songs to include in <strong>'+escapeHTML(playlist.name||"Playlist")+'</strong>.</p>'+
      (checks||"<p>No uploaded songs are available yet.</p>")+
      '<button type="submit" class="btn primary">Save Songs</button></form>');
  }

  async function loadEventsPage() {
    const container=$(".page-container"), api=window.ApostolicSupabase, user=currentUser();
    if(!container || !api || !api.isConfigured()) return;
    try {
      const result=await api.select("events","*",{order:{column:"starts_at",ascending:true},limit:100});
      const rows=result?.data||[];
      const cards=rows.map(function(row){
        const own=user && row.organizer_id===user.id;
        const actions=own?'<button type="button" class="btn" data-content-action="edit-event" data-content-id="'+escapeHTML(row.id)+'">Edit</button><button type="button" class="btn" data-content-action="delete-event" data-content-id="'+escapeHTML(row.id)+'">Delete</button>':"";
        return renderCard("📅",row.title||"Event",(row.starts_at?new Date(row.starts_at).toLocaleString()+" — ":"")+(row.location||"")+(row.description?"<br>"+escapeHTML(row.description):""),actions);
      }).join("");
      container.insertAdjacentHTML("beforeend",'<section class="content-grid">'+(cards||renderCard("📅","No Events Yet","Create your first Christian event."))+'</section>');
    } catch(e){console.error("Events load failed:",e);}
  }

  async function loadAdminDashboard() {
    const container=$(".page-container"), api=window.ApostolicSupabase, user=currentUser();
    if(!container || !user || !api || !api.isConfigured()) return;
    try {
      const profileResult=await api.select("profiles","*",{eq:{id:user.id}});
      const profile=profileResult?.data?.[0]||{};
      if(!["admin","super_admin"].includes(profile.role||"user")){
        container.insertAdjacentHTML("beforeend",'<section class="content-grid">'+renderCard("🔒","Admin Access","Administrator permission is required.")+'</section>');
        return;
      }
      const [users,posts,media,downloads,likes]=await Promise.all([
        api.select("profiles","*",{order:{column:"created_at",ascending:false},limit:200}),
        api.select("community_posts","*",{order:{column:"created_at",ascending:false},limit:100}),
        api.select("media_uploads","*",{order:{column:"created_at",ascending:false},limit:100}),
        api.select("downloads","*",{order:{column:"created_at",ascending:false},limit:200}),
        api.select("likes","*",{order:{column:"created_at",ascending:false},limit:200})
      ]);
      const userRows=users?.data||[],postRows=posts?.data||[],mediaRows=media?.data||[];
      const stats='<section class="content-grid">'+renderCard("👥","Users",String(userRows.length))+renderCard("💬","Community Posts",String(postRows.length))+renderCard("📁","Uploaded Media",String(mediaRows.length))+renderCard("⇩","Downloads",String((downloads?.data||[]).length))+renderCard("❤️","Likes",String((likes?.data||[]).length))+'</section>';
      const userCards=userRows.map(p=>renderCard("👤",p.full_name||"User",String(p.role||"user"),p.id===user.id?"":"<button type=\"button\" class=\"btn\" data-admin-role-id=\""+escapeHTML(p.id)+"\">Change Role</button>")).join("");
      const postCards=postRows.map(p=>renderCard("💬",p.title||"Community Post",p.content||"",'<button type="button" class="btn" data-admin-post-id="'+escapeHTML(p.id)+'" data-admin-publish="'+String(!p.is_published)+'">'+(p.is_published?"Unpublish":"Publish")+'</button>')).join("");
      const mediaCards=mediaRows.map(m=>renderCard("📁",m.title||m.file_name||"Media",m.description||"",'<button type="button" class="btn" data-admin-media-id="'+escapeHTML(m.id)+'" data-admin-publish="'+String(!m.is_published)+'">'+(m.is_published?"Unpublish":"Publish")+'</button>')).join("");
      container.insertAdjacentHTML("beforeend",stats+'<section class="content-grid">'+(userCards||renderCard("👥","No Users",""))+'</section><section class="content-grid">'+(postCards||renderCard("💬","No Posts",""))+'</section><section class="content-grid">'+(mediaCards||renderCard("📁","No Media",""))+'</section>');
    } catch(e){console.error("Admin dashboard failed:",e);toast("Could not load admin dashboard.","error");}
  }

  async function loadCreatorDashboard() {
    const container = $(".page-container");
    const user = currentUser();
    const api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("media_uploads", "*", {
        eq: { user_id: user.id },
        order: { column: "created_at", ascending: false },
        limit: 200
      });
      const items = result?.data || [];
      const counts = {};
      items.forEach(function(item){ counts[item.type] = (counts[item.type] || 0) + 1; });
      const summary = '<section class="content-grid">' +
        renderCard("📊", "My Content", String(items.length) + " published/uploaded items.") +
        renderCard("✏️", "Editable", "Your own items can be edited or deleted.") +
        renderCard("📁", "Content Types", String(Object.keys(counts).length) + " types in your library.") +
        '</section>';
      const cards = items.map(function(item) {
        const actions = (item.file_url ? '<a class="btn" href="' + escapeHTML(item.file_url) + '" target="_blank" rel="noopener">Open</a>' : '') +
          contentActionButtons("media_upload", item.id, item.user_id);
        return renderCard("📝", item.title || item.file_name || "Untitled", item.description || "", actions);
      }).join("");
      container.insertAdjacentHTML("beforeend", summary + '<section class="content-grid">' +
        (cards || renderCard("📂", "No Content Yet", "Create or upload your first Christian resource.")) + '</section>');
    } catch (error) { console.error("Creator dashboard failed:", error); }
  }

  async function loadDownloadsPage() {
    const container = $(".page-container"), user = currentUser(), api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("downloads", "*", {
        eq: { user_id: user.id },
        order: { column: "created_at", ascending: false }, limit: 100
      });
      const rows = result?.data || [];
      const cards = rows.map(function(row) {
        return renderCard("⇩", row.content_type || "Download", "Downloaded content: " + String(row.content_id || ""));
      }).join("");
      container.insertAdjacentHTML("beforeend", '<section class="content-grid">' +
        (cards || renderCard("⇩", "No Downloads Yet", "Your downloaded resources will appear here.")) + '</section>');
    } catch(error) { console.error("Downloads failed:", error); }
  }

  async function loadMediaForPage(route) {
    const types = mediaRouteTypes[route];
    if (!Array.isArray(types) || !types.length) return;

    const container = $(".page-container");
    if (!container) return;

    const section = document.createElement("section");
    section.className = "content-grid media-content-grid";
    section.innerHTML = `
      <article class="card media-loading-card">
        <div class="card-icon">⏳</div>
        <h3>Media Library</h3>
        <p>Loading your saved content...</p>
      </article>
    `;
    container.appendChild(section);

    let uploaded = [];
    let uploadError = null;

    try {
      const api = window.ApostolicSupabase;
      if (api && api.isConfigured()) {
        const result = await api.select(
          "media_uploads",
          "*",
          {
            order: {
              column: "created_at",
              ascending: false
            },
            limit: 100
          }
        );
        uploaded = result && Array.isArray(result.data)
          ? result.data.filter(function (item) {
              return item && types.includes(item.type);
            })
          : [];
        uploadError = result && result.error
          ? result.error
          : null;
      }
    } catch (error) {
      uploadError = error;
    }

    const localItems = storage.get(
      "apostolic_created_items",
      []
    ).filter(function (item) {
      if (!item || !types.includes(item.type)) {
        return false;
      }

      return !uploaded.some(function (remoteItem) {
        return (
          remoteItem &&
          remoteItem.type === item.type &&
          remoteItem.title === item.title
        );
      });
    });

    const cards = [];

    uploaded.forEach(function (item) {
      const title = item.title || item.file_name || "Untitled";
      const description =
        item.description ||
        (item.file_name
          ? "Uploaded media file."
          : "Saved media content.");

      const openAction = item.file_url
        ? `<a class="btn" href="${escapeHTML(item.file_url)}" target="_blank" rel="noopener">Open File</a>`
        : "";
      const action = openAction + renderEngagementActions("media_upload", item.id, item.file_url || "") + contentActionButtons("media_upload", item.id, item.user_id || null);

      cards.push(renderCard(
        item.file_name ? "📎" : "📝",
        title,
        description,
        action
      ));
    });

    localItems.forEach(function (item) {
      const localActions = '<div class="card-actions">' +
        '<button type="button" class="btn" data-content-action="edit-local" data-content-type="' + escapeHTML(item.type) + '" data-content-id="' + escapeHTML(item.id) + '">Edit</button>' +
        '<button type="button" class="btn" data-content-action="delete-local" data-content-type="' + escapeHTML(item.type) + '" data-content-id="' + escapeHTML(item.id) + '">Delete</button>' +
      '</div>';
      cards.push(renderCard(
        "📝",
        item.title || "Untitled",
        item.description || "Created content.",
        localActions
      ));
    });

    if (uploadError && cards.length === 0) {
      cards.push(renderCard(
        "⚠️",
        "Media Library",
        "Could not load saved media right now. Please refresh and try again.",
        ""
      ));
    } else if (cards.length === 0) {
      cards.push(renderCard(
        "📂",
        "No Media Yet",
        "Content you create or upload here will appear in this section.",
        ""
      ));
    }

    section.innerHTML = cards.join("");
  }

  function refreshCurrentMediaPage() {
    const route = window.location.hash
      ? window.location.hash.substring(1)
      : "";
    if (route && mediaRouteTypes[route]) {
      renderPage(route);
    }
  }

  /* =========================================================
     RENDER PAGE
     ========================================================= */

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

    /*
      Important:
      mainContent itself remains the main page container.
      We only replace its contents.
    */

    main.innerHTML = `
      <div class="page-container">
        ${page.content}
      </div>
    `;

    initThemeControls();
    initLanguageControls();

    loadMediaForPage(cleanRoute);

    loadCommunityPosts();
    if (cleanRoute === "saved") loadSavedContent();
    if (cleanRoute === "notifications") loadNotifications();
    if (cleanRoute === "profile") loadProfilePage();
    if (cleanRoute === "qa") loadQA();
    if (cleanRoute === "creator") loadCreatorDashboard();
    if (cleanRoute === "downloads") loadDownloadsPage();
    if (cleanRoute === "folders") loadFoldersPage();
    if (cleanRoute === "playlists") loadPlaylistsPage();
    if (cleanRoute === "events") loadEventsPage();
    if (cleanRoute === "admin") loadAdminDashboard();

    /*
      Always bring the newly selected page
      to the top.
    */

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  }

  /* =========================================================
     ROUTER INITIALIZATION
     ========================================================= */

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

    if (window.ApostolicRouter) {

      /*
        router.js supports start().
        This is intentionally NOT init().
      */

      window.ApostolicRouter.start();

      /*
        If the current hash is empty,
        explicitly load Home.
      */

      if (!window.location.hash) {
        window.ApostolicRouter.navigate(
          "#home",
          true
        );
      }

    } else {

      renderPage(
        initialRoute
      );
    }
  }

  /* =========================================================
     GENERAL ACTIONS
     ========================================================= */

  function initActions() {

    $$(
      "[data-action]"
    ).forEach(function (element) {

      if (
        element.dataset.actionBound
      ) {
        return;
      }

      const action =
        element.dataset.action;

      if (
        action ===
        "toggle-sidebar"
      ) {
        element.dataset.actionBound =
          "true";

        return;
      }

      if (
        action ===
        "toggle-theme"
      ) {
        element.dataset.actionBound =
          "true";

        element.addEventListener(
          "click",
          function () {
            theme.toggle();
          }
        );

        return;
      }

      if (
        action ===
        "language"
      ) {
        element.dataset.actionBound =
          "true";

        element.addEventListener(
          "click",
          function () {

            const current =
              language.get();

            if (current === "en") {
              language.set("am");
              toast(
                "Language changed to አማርኛ.",
                "success"
              );
            } else {
              language.set("en");
              toast(
                "Language changed to English.",
                "success"
              );
            }

          }
        );
      }
    });
  }

  /* =========================================================
     INITIALIZATION
     ========================================================= */

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

  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.ApostolicApp = {

    version:
      APP.version,

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

  /* =========================================================
     START APPLICATION
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }

})();
