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

          <div class="form-group teaching-post-editor">
            <label for="createDescription">
              Teaching / Post
            </label>

            <textarea
              id="createDescription"
              name="description"
              rows="14"
              maxlength="50000"
              placeholder="Write or paste your teaching here... You can write a long message just like a Facebook post."
            ></textarea>

            <small class="form-help">
              You can write or paste a long teaching, with multiple paragraphs.
            </small>
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
    const modal = createModal(title, `
      <form class="dynamic-form" data-upload-form="${escapeHTML(type)}">
        <div class="form-group"><label>Title (optional for batch)</label><input name="title" type="text" placeholder="Enter a title"></div>
        <div class="form-group"><label>Select files (up to 12)</label><input id="uploadFile" name="file" type="file" multiple required><small>You can select up to 12 files at once.</small></div>
        <div class="form-group"><label>Description</label><textarea name="description" rows="4" placeholder="Write a description..."></textarea></div>
        <div class="upload-status" hidden role="status" aria-live="polite"></div>
        <button type="button" class="btn primary" data-upload-submit>Upload</button>
      </form>`);
    const button=modal.querySelector("[data-upload-submit]"), form=modal.querySelector("[data-upload-form]"), input=modal.querySelector("#uploadFile");
    if(input) input.addEventListener("change",()=>{ if(input.files.length>12){input.value="";toast("You can select a maximum of 12 files at once.","error");} });
    if(button&&form) button.addEventListener("click",e=>{e.preventDefault();handleUploadSubmit(form);});
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
    const route = (window.location.hash || "").substring(1).split("?")[0];
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
      if (!isCurrentRoute("community")) return;
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

        const openMedia = event.target.closest("[data-open-media]");
        if (openMedia) {
          event.preventDefault();
          const item = (window.__apostolicMediaById || {})[String(openMedia.dataset.openMedia)];
          openMediaViewer(item);
          return;
        }

        const mediaPlay = event.target.closest("[data-media-play]");
        if (mediaPlay) {
          event.preventDefault();
          const item = (window.__apostolicSongs || []).find(function(x){ return String(x.id) === String(mediaPlay.dataset.mediaPlay); });
          openMusicPlayer(item);
          return;
        }
        const mediaShort = event.target.closest("[data-media-short]");
        if (mediaShort) {
          event.preventDefault();
          const item = (window.__apostolicShorts || []).find(function(x){ return String(x.id) === String(mediaShort.dataset.mediaShort); });
          if (item) openShortsFeed([item]);
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
          const user = currentUser();
          const api = window.ApostolicSupabase;
          try {
            const fullName = String(data.get("full_name") || "").trim();
            const avatarFile = data.get("avatar");
            const updateData = { full_name: fullName };

            if (avatarFile && avatarFile.size) {
              if (!String(avatarFile.type || "").startsWith("image/")) throw new Error("Please choose an image file.");
              if (avatarFile.size > 5 * 1024 * 1024) throw new Error("Profile photo must be 5 MB or smaller.");
              const extensionMap = {"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif"};
              const extension = extensionMap[avatarFile.type];
              if (!extension) throw new Error("Use JPG, PNG, WebP, or GIF for the profile photo.");

              const path = user.id + "/profile-avatar." + extension;
              const upload = await api.uploadFile("Apostolic_Media", path, avatarFile, {upsert:true, contentType:avatarFile.type});
              if (upload?.error) throw upload.error;

              const avatarUrl = api.getPublicUrl("Apostolic_Media", path);
              if (!avatarUrl) throw new Error("Could not create the profile photo URL.");
              updateData.avatar_url = avatarUrl + "?v=" + Date.now();
            }

            const result = await api.update("profiles", updateData, {id:user.id});
            if (result?.error) throw result.error;
            toast("Profile updated successfully.", "success");
            if (window.ApostolicAuth?.syncProfile) await window.ApostolicAuth.syncProfile();
            renderPage("profile");
          } catch (error) {
            console.error("Profile update failed:", error);
            toast(error?.message || "Could not update profile.", "error");
          }
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
            const commentPayload = { user_id: currentUser().id, content: String(data.get("content") || "").trim() };
            if (commentForm.dataset.commentType === "community_post") commentPayload.post_id = commentForm.dataset.commentId;
            else commentPayload.media_id = commentForm.dataset.commentId;
            const result = await window.ApostolicSupabase.insert("comments", commentPayload);
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
    if (action === "love") {
      if (!requireLogin()) return;
      const api = window.ApostolicSupabase, user = currentUser();
      try {
        const existing = await api.select("reactions", "*", { eq: { user_id: user.id, content_type: type, content_id: id, reaction: "love" } });
        if (existing?.data?.length) {
          await api.remove("reactions", { user_id: user.id, content_type: type, content_id: id, reaction: "love" });
          toast("Love removed.", "info");
        } else {
          const result = await api.insert("reactions", { user_id: user.id, content_type: type, content_id: id, reaction: "love" });
          if (result?.error) throw result.error;
          toast("❤️ Loved.", "success");
        }
      } catch (e) { toast(e?.message || "Could not update love.", "error"); }
      return;
    }
    if (action === "share") {
      const item = (window.__apostolicMediaById || {})[String(id)];
      const shareText = item?.title || "Apostolic Media";
      const shareUrl = window.location.href;
      try {
        if (navigator.share) await navigator.share({ title: shareText, text: shareText, url: shareUrl });
        else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(shareUrl); toast("Share link copied.", "success"); }
        else toast("Share is not supported on this device.", "info");
      } catch (e) {
        if (e?.name !== "AbortError") toast("Could not share this content.", "error");
      }
      return;
    }
    if (action === "download") {
      if (!requireLogin()) return;
      const item = (window.__apostolicMediaById || {})[String(id)];
      if (item) {
        openMediaViewer(item);
      } else {
        toast("Open the content first to view it in the app.", "info");
      }
      try {
        await window.ApostolicSupabase.insert("downloads", {
          user_id: currentUser().id,
          content_type: type,
          content_id: id
        });
      } catch (error) {}
      return;
    }
    if (action === "comments") {
      await showComments(type, id, element.dataset.contentTitle || "Content");
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

    if (action === "edit" && type === "folder") {
      try { const r=await api.select("folders","*",{eq:{id:id,created_by:auth.getUser().id}}); const row=r?.data?.[0]; if(!row){toast("Folder not found.","error");return;} showFolderForm(row); } catch(e){toast(e?.message||"Could not load folder.","error");}
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

  function openBibleReader() {
    const books = [
      ["Genesis","GEN",50],["Exodus","EXO",40],["Leviticus","LEV",27],["Numbers","NUM",36],["Deuteronomy","DEU",34],
      ["Joshua","JOS",24],["Judges","JDG",21],["Ruth","RUT",4],["1 Samuel","1SA",31],["2 Samuel","2SA",24],
      ["1 Kings","1KI",22],["2 Kings","2KI",25],["1 Chronicles","1CH",29],["2 Chronicles","2CH",36],["Ezra","EZR",10],
      ["Nehemiah","NEH",13],["Esther","EST",10],["Job","JOB",42],["Psalms","PSA",150],["Proverbs","PRO",31],
      ["Ecclesiastes","ECC",12],["Song of Solomon","SNG",8],["Isaiah","ISA",66],["Jeremiah","JER",52],["Lamentations","LAM",5],
      ["Ezekiel","EZK",48],["Daniel","DAN",12],["Hosea","HOS",14],["Joel","JOL",3],["Amos","AMO",9],
      ["Obadiah","OBA",1],["Jonah","JON",4],["Micah","MIC",7],["Nahum","NAM",3],["Habakkuk","HAB",3],
      ["Zephaniah","ZEP",3],["Haggai","HAG",2],["Zechariah","ZEC",14],["Malachi","MAL",4],
      ["Matthew","MAT",28],["Mark","MRK",16],["Luke","LUK",24],["John","JHN",21],["Acts","ACT",28],
      ["Romans","ROM",16],["1 Corinthians","1CO",16],["2 Corinthians","2CO",13],["Galatians","GAL",6],
      ["Ephesians","EPH",6],["Philippians","PHP",4],["Colossians","COL",4],["1 Thessalonians","1TH",5],
      ["2 Thessalonians","2TH",3],["1 Timothy","1TI",6],["2 Timothy","2TI",4],["Titus","TIT",3],
      ["Philemon","PHM",1],["Hebrews","HEB",13],["James","JAS",5],["1 Peter","1PE",5],["2 Peter","2PE",3],
      ["1 John","1JN",5],["2 John","2JN",1],["3 John","3JN",1],["Jude","JUD",1],["Revelation","REV",22]
    ];
    const state = storage.get("apostolic_bible_position",{version:"kjv",book:"Genesis",chapter:1});
    const settings = storage.get("apostolic_bible_settings",{fontSize:18,theme:"light"});
    const bookmarks = storage.get("apostolic_bible_bookmarks",[]);
    const modal = createModal("Bible Reader", `
      <div class="bible-reader-shell" data-bible-reader>
        <div class="bible-offline-guide">
          <div class="bible-offline-guide-icon">📖</div>
          <div>
            <strong>Offline መጽሐፍ ቅዱስ</strong>
            <p>ኢንተርኔት እያለ <b>⬇️ Offline</b> ቁልፍን ተጫን። ማውረዱ ከተጠናቀቀ በኋላ ያለ ኢንተርኔት ሁሉንም 66 መጻሕፍት በዚህ App ውስጥ ማንበብ ትችላለህ።</p>
          </div>
        </div>
        <div class="bible-reader-toolbar">
          <select class="bible-select" data-bible-version aria-label="Bible version">
            <option value="kjv">King James Version (English)</option>
            <option value="amhara">አማርኛ መጽሐፍ ቅዱስ</option>
          </select>
          <select class="bible-select" data-bible-book aria-label="Bible book">
            ${books.map(function(item){ return '<option value="'+item[1]+'">'+escapeHTML(item[0])+'</option>'; }).join("")}
          </select>
          <select class="bible-select" data-bible-chapter aria-label="Bible chapter"></select>
          <button type="button" class="btn primary" data-bible-load>Read</button>
        </div>
        <div class="bible-reader-tools">
          <button type="button" class="btn" data-bible-font-down>A−</button>
          <button type="button" class="btn" data-bible-font-up>A+</button>
          <button type="button" class="btn" data-bible-theme="light">☀️</button>
          <button type="button" class="btn" data-bible-theme="sepia">📖</button>
          <button type="button" class="btn" data-bible-theme="dark">🌙</button>
          <button type="button" class="btn" data-bible-bookmark>🔖 Bookmark</button>
          <button type="button" class="btn" data-bible-offline>⬇️ Offline</button>
        </div>
        <div class="bible-reader-note" data-bible-status>Choose a translation, book and chapter. Your position, bookmarks and reading settings are saved on this device.</div><div class="bible-offline-progress" aria-hidden="true"><span data-bible-progress></span></div>
        <article class="bible-reader-page" data-bible-page>
          <span class="bible-reader-kicker" data-bible-kicker>KING JAMES VERSION</span>
          <h2 data-bible-title>Genesis 1</h2>
          <p class="bible-reader-placeholder" data-bible-placeholder>Loading Scripture…</p>
          <div class="bible-reader-lines" data-bible-lines aria-live="polite"></div>
        </article>
      </div>`);
    modal.classList.add("bible-reader-modal");
    const version=modal.querySelector("[data-bible-version]"), book=modal.querySelector("[data-bible-book]");
    const chapter=modal.querySelector("[data-bible-chapter]"), load=modal.querySelector("[data-bible-load]");
    const title=modal.querySelector("[data-bible-title]"), kicker=modal.querySelector("[data-bible-kicker]");
    const lines=modal.querySelector("[data-bible-lines]"), placeholder=modal.querySelector("[data-bible-placeholder]");
    const status=modal.querySelector("[data-bible-status]"), page=modal.querySelector("[data-bible-page]");
    const offlineButton=modal.querySelector("[data-bible-offline]");
    if(!version||!book||!chapter||!load||!title||!lines) return;

    function selectedBook(){return books.find(function(item){return item[1]===book.value;})||books[0];}
    function updateChapters(selectedChapter){
      const info=selectedBook();
      chapter.innerHTML=Array.from({length:info[2]},function(_,i){return '<option value="'+(i+1)+'">Chapter '+(i+1)+'</option>';}).join("");
      chapter.value=String(Math.min(Number(selectedChapter)||1,info[2]));
    }
    function applySettings(){
      page.style.fontSize=String(settings.fontSize)+"px";
      page.dataset.readerTheme=settings.theme;
      $$("[data-bible-theme]",modal).forEach(function(btn){btn.classList.toggle("active",btn.dataset.bibleTheme===settings.theme);});
    }
    const BIBLE_OFFLINE_CACHE="apostolic-bible-offline-v3";
    function bibleBookSlug(name){
      return String(name||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
    }
    function bibleSourceUrl(v,b,c){
      const index=books.findIndex(function(item){return item[1]===b;});
      const number=String(index+1).padStart(2,"0");
      const slug=bibleBookSlug(books[index]?.[0]||b);
      if(v==="kjv"){
        return "https://raw.githubusercontent.com/nolanbaxter/kjv-bible/main/"+slug+".json";
      }
      const folder=index<39?"old-testament":"new-testament";
      return "https://raw.githubusercontent.com/biniama/ethiopic-bible-data/main/data/"+folder+"/"+number+"-"+slug+".json";
    }
    function chapterDataFromJson(v,json,c){
      if(v==="kjv"){
        const chapter=json&&json.chapters&&json.chapters[String(c)];
        if(!chapter) return [];
        return Object.keys(chapter).map(function(verseNum){
          return {verseNum:verseNum,verse:String(chapter[verseNum]??"")};
        }).filter(function(item){return item.verse!=="";});
      }
      let chapter=null;
      if(Array.isArray(json?.chapters)){
        chapter=json.chapters.find(function(item){
          return Number(item.chapter??item.number)===Number(c);
        });
      }else if(json?.chapters && typeof json.chapters==="object"){
        chapter=json.chapters[String(c)];
      }else if(json && json[String(c)]){
        chapter=json[String(c)];
      }
      const verses=Array.isArray(chapter) ? chapter : (chapter&&Array.isArray(chapter.verses) ? chapter.verses : []);
      return verses.map(function(item,index){
        const rawText=item?.text;
        const textValue=typeof rawText==="string"
          ? rawText
          : String(rawText?.am??rawText?.en??rawText?.gez??item?.am??item?.text_am??item?.content??"");
        return {verseNum:item?.verse??item?.verseNum??item?.number??(index+1),verse:textValue};
      }).filter(function(item){return item.verse.trim()!=="";});
    }
    async function downloadBibleOffline(){
      if(!offlineButton) return;
      offlineButton.disabled=true;
      let done=0;
      const total=books.length*2;
      try{
        const cache=await caches.open(BIBLE_OFFLINE_CACHE);
        for(const v of ["kjv","amhara"]){
          for(const item of books){
            const url=bibleSourceUrl(v,item[1],1);
            const existing=await cache.match(url);
            if(!existing){
              const response=await fetch(url,{headers:{"Accept":"application/json"},cache:"no-store"});
              if(!response.ok) throw new Error("Download failed for "+item[0]);
              await cache.put(url,response.clone());
            }
            done++;
            const percent=Math.min(100,Math.round((done/total)*100));
            status.textContent=percent+"%";
            if(offlineProgress) offlineProgress.style.width=percent+"%";
          }
        }
        storage.set("apostolic_bible_offline_ready",{ready:true,savedAt:Date.now()});
        status.textContent="100%";
        toast("ሙሉ መጽሐፍ ቅዱስ offline ተዘጋጅቷል።","success");
      }catch(error){
        console.error("Offline Bible download failed:",error);
        const percent=Math.min(99,Math.round((done/total)*100));
        status.textContent=percent+"%";
        if(offlineProgress) offlineProgress.style.width=percent+"%";
        toast("የoffline ማውረድ አልተጠናቀቀም።","error");
      }finally{
        offlineButton.disabled=false;
      }
    }
    function cacheKey(v,b,c){return "apostolic_bible_chapter_"+v+"_"+b+"_"+c;}
    async function fetchChapter(v,b,c){
      const key=cacheKey(v,b,c), cached=storage.get(key,null);
      if(cached&&Array.isArray(cached.data)) return cached;
      const url=bibleSourceUrl(v,b,c);
      let response;
      try{
        response=await fetch(url,{headers:{"Accept":"application/json"}});
        if(!response.ok) throw new Error("HTTP "+response.status);
      }catch(networkError){
        const offlineCache=await caches.open(BIBLE_OFFLINE_CACHE);
        response=await offlineCache.match(url);
        if(!response) throw networkError;
      }
      const json=await response.json();
      const data=chapterDataFromJson(v,json,c);
      if(!data.length) throw new Error("No verses were returned");
      const result={data:data,savedAt:Date.now()};
      storage.set(key,result);
      return result;
    }
    async function loadChapter(){
      const selected=selectedBook(), v=version.value, c=Number(chapter.value)||1, name=selected[0];
      title.textContent=name+" "+c;
      kicker.textContent=v==="kjv"?"KING JAMES VERSION · ENGLISH":"አማርኛ መጽሐፍ ቅዱስ";
      placeholder.textContent="Loading Scripture…"; lines.innerHTML=""; status.textContent="Opening "+name+" "+c+"…"; applySettings();
      try{
        const result=await fetchChapter(v,selected[1],c);
        lines.innerHTML=result.data.map(function(item){
          const n=escapeHTML(item.verseNum??item.verse??""), textValue=escapeHTML(item.verse??item.text??item.content??"");
          return '<div><b>'+n+'</b> <span>'+textValue+'</span></div>';
        }).join("");
        placeholder.textContent=v==="kjv"?"King James Version · Public-domain English text.":"አማርኛ ትርጉም · በአፕ ውስጥ ለማንበብ የተጫነ።";
        status.textContent="Saved reading position: "+name+" "+c;
        storage.set("apostolic_bible_position",{version:v,book:name,bookId:selected[1],chapter:c});
      }catch(error){
        console.error("Bible chapter load failed:",error);
        placeholder.textContent="The chapter could not be loaded right now. Previously cached chapters remain available offline.";
        status.textContent="Please check your internet connection and try again.";
      }
    }
    version.value=state.version||"kjv";
    const savedBook=books.find(function(item){return item[0]===(state.book||"Genesis")||item[1]===state.bookId;})||books[0];
    book.value=savedBook[1]; updateChapters(state.chapter||1); applySettings();
    book.addEventListener("change",function(){updateChapters(1);});
    version.addEventListener("change",function(){status.textContent="Translation changed. Press Read.";});
    load.addEventListener("click",loadChapter);
    if(offlineButton) offlineButton.addEventListener("click",downloadBibleOffline);
    const fontDown=modal.querySelector("[data-bible-font-down]"), fontUp=modal.querySelector("[data-bible-font-up]");
    if(fontDown) fontDown.addEventListener("click",function(){settings.fontSize=Math.max(14,settings.fontSize-1);storage.set("apostolic_bible_settings",settings);applySettings();});
    if(fontUp) fontUp.addEventListener("click",function(){settings.fontSize=Math.min(26,settings.fontSize+1);storage.set("apostolic_bible_settings",settings);applySettings();});
    $$("[data-bible-theme]",modal).forEach(function(btn){btn.addEventListener("click",function(){settings.theme=btn.dataset.bibleTheme;storage.set("apostolic_bible_settings",settings);applySettings();});});
    const bookmark=modal.querySelector("[data-bible-bookmark]");
    if(bookmark) bookmark.addEventListener("click",function(){
      const selected=selectedBook(), item={version:version.value,book:selected[0],bookId:selected[1],chapter:Number(chapter.value)||1};
      const key=item.version+"|"+item.bookId+"|"+item.chapter, next=bookmarks.filter(function(x){return x.version+"|"+x.bookId+"|"+x.chapter!==key;});
      next.unshift(item); storage.set("apostolic_bible_bookmarks",next.slice(0,20)); toast("Bible chapter bookmarked.","success");
    });
    loadChapter();
  }
  function openMediaViewer(item) {
    if (!item) {
      toast("This content could not be opened.", "error");
      return;
    }
    if (!item.file_url) {
      createModal(item.title || "Read content",
        '<article class="in-app-text-reader"><p>' + escapeHTML(item.description || "No written content is available.") + '</p></article>');
      return;
    }
    let url = "";
    try {
      const parsed = new URL(item.file_url, window.location.href);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Unsupported URL");
      url = parsed.href;
    } catch (error) {
      toast("This file link is not safe or valid.", "error");
      return;
    }

    const name = String(item.file_name || item.title || "Content").toLowerCase();
    const mime = String(item.file_type || "").toLowerCase();
    const isImage = mime.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(name);
    const isAudio = mime.startsWith("audio/") || /\.(mp3|m4a|wav|ogg|aac|flac)(\?|#|$)/i.test(name);
    const isVideo = mime.startsWith("video/") || /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(name);
    const isPdf = mime === "application/pdf" || /\.pdf(\?|#|$)/i.test(name);
    let viewer = "";

    if (isImage) {
      viewer = '<div class="in-app-media-image-wrap"><img class="in-app-media-image" src="' + escapeHTML(url) + '" alt="' + escapeHTML(item.title || "Image") + '"></div>';
    } else if (isAudio) {
      viewer = '<audio class="in-app-media-audio" controls autoplay preload="metadata" src="' + escapeHTML(url) + '"></audio>';
    } else if (isVideo) {
      viewer = '<video class="in-app-media-video" controls playsinline preload="metadata" src="' + escapeHTML(url) + '"></video>';
    } else if (isPdf) {
      viewer = '<iframe class="in-app-media-pdf" title="' + escapeHTML(item.title || "PDF document") + '" src="' + escapeHTML(url) + '#toolbar=1&navpanes=0" loading="lazy"></iframe>';
    } else {
      const safeName = String(item.file_name || item.title || "document").replace(/[^a-zA-Z0-9._-]/g, "_");
      viewer = '<div class="in-app-media-document"><div class="card-icon">📄</div><h3>' + escapeHTML(item.title || item.file_name || "Document") + '</h3><p>This document format is best opened with a reader on your device.</p><div class="document-file-meta">📎 ' + escapeHTML(item.file_name || safeName) + '</div><a class="btn primary document-download-btn" href="' + escapeHTML(url) + '" download="' + escapeHTML(safeName) + '">⬇️ Download &amp; Open with device</a><p class="document-open-note">After downloading, choose the reader app you want from your device's “Open with” options.</p></div>';
    }

    createModal(item.title || item.file_name || "Read content",
      '<div class="in-app-media-viewer"><p class="in-app-media-description">' + escapeHTML(item.description || "") + '</p>' + viewer + '</div>');
  }

  function openMusicPlayer(item, options) {
    if (!item || !item.file_url) {
      toast("This song does not have a playable file yet.", "error");
      return;
    }
    const songs = window.__apostolicSongs || [];
    const index = Math.max(0, songs.findIndex(function(x){ return String(x.id) === String(item.id); }));
    let player = document.querySelector(".apostolic-mini-player");
    if (!player) {
      player = document.createElement("aside");
      player.className = "apostolic-mini-player";
      document.body.appendChild(player);
    }
    player.innerHTML =
      '<div class="mini-player-art">🎵</div>' +
      '<div class="mini-player-info"><strong>' + escapeHTML(item.title || "Untitled Song") + '</strong><span>' + escapeHTML(item.description || "Christian worship") + '</span></div>' +
      '<div class="mini-player-controls">' +
        '<button type="button" class="mini-player-skip" data-mini-prev aria-label="Previous song">⏮</button>' +
        '<audio controls autoplay preload="metadata" src="' + escapeHTML(item.file_url) + '"></audio>' +
        '<button type="button" class="mini-player-skip" data-mini-next aria-label="Next song">⏭</button>' +
      '</div>' +
      '<button type="button" class="mini-player-close" aria-label="Close player">×</button>';
    player.hidden = false;
    const audio = player.querySelector("audio");
    const close = player.querySelector(".mini-player-close");
    const prev = player.querySelector("[data-mini-prev]");
    const next = player.querySelector("[data-mini-next]");
    if (close) close.addEventListener("click", function(){ audio.pause(); player.remove(); });
    if (prev) prev.disabled = !songs.length || index <= 0;
    if (next) next.disabled = !songs.length || index >= songs.length - 1;
    if (prev) prev.addEventListener("click", function(){
      if (songs[index - 1]) openMusicPlayer(songs[index - 1], {silent:true});
    });
    if (next) next.addEventListener("click", function(){
      if (songs[index + 1]) openMusicPlayer(songs[index + 1], {silent:true});
    });
    audio.addEventListener("ended", function(){
      if (songs[index + 1]) openMusicPlayer(songs[index + 1], {silent:true});
    });
    storage.set("apostolic_last_song",{id:item.id,title:item.title||"",file_url:item.file_url});
    if (!options || !options.silent) toast("Now playing: " + (item.title || "Song"), "success");
  }

  function initMiniPlayer() {
    const saved = storage.get("apostolic_last_song", null);
    if (!saved || !saved.file_url || document.querySelector(".apostolic-mini-player")) return;
    const songs = window.__apostolicSongs || [];
    const match = songs.find(function(x){ return String(x.id) === String(saved.id); });
    if (match) {
      openMusicPlayer(match, {silent:true});
      const audio = document.querySelector(".apostolic-mini-player audio");
      if (audio) audio.pause();
      return;
    }
    const player = document.createElement("aside");
    player.className = "apostolic-mini-player";
    player.innerHTML =
      '<div class="mini-player-art">🎵</div>' +
      '<div class="mini-player-info"><strong>' + escapeHTML(saved.title || "Last Song") + '</strong><span>Ready to continue</span></div>' +
      '<audio controls preload="metadata" src="' + escapeHTML(saved.file_url) + '"></audio>' +
      '<button type="button" class="mini-player-close" aria-label="Close player">×</button>';
    document.body.appendChild(player);
    const audio=player.querySelector("audio"), close=player.querySelector(".mini-player-close");
    if(close) close.addEventListener("click",function(){audio.pause();player.remove();});
  }

  function openShortsFeed(items) {
    const playable=(items||[]).filter(function(item){return item && item.file_url;});
    if(!playable.length){ toast("No video files are available yet.","info"); return; }
    const cards=playable.map(function(item,index){
      return '<article class="shorts-feed-card" data-short-index="' + index + '">' +
        '<video controls playsinline muted preload="' + (index===0?"metadata":"none") + '" src="' + escapeHTML(item.file_url) + '"></video>' +
        '<div class="shorts-feed-overlay"><span>SHORT CHRISTIAN VIDEO</span><h3>' + escapeHTML(item.title||"Christian Video") + '</h3><p>' + escapeHTML(item.description||"Watch and grow in faith.") + '</p>' +
        '<div class="card-actions"><button type="button" class="btn" data-content-action="like" data-content-type="media_upload" data-content-id="' + escapeHTML(item.id) + '">♡ Like</button><button type="button" class="btn" data-content-action="save" data-content-type="media_upload" data-content-id="' + escapeHTML(item.id) + '">🔖 Save</button></div></div></article>';
    }).join("");
    const modal=createModal("Shorts", '<div class="shorts-feed">' + cards + '</div>');
    const videos=Array.from(modal.querySelectorAll(".shorts-feed-card video"));
    if ("IntersectionObserver" in window) {
      const observer=new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          const video=entry.target;
          if(entry.isIntersecting && entry.intersectionRatio >= 0.7){
            videos.forEach(function(other){ if(other!==video) other.pause(); });
            video.play().catch(function(){});
          } else {
            video.pause();
          }
        });
      },{threshold:[0.7]});
      videos.forEach(function(video){observer.observe(video);});
      modal.addEventListener("click",function(event){
        if(event.target.closest("[data-modal-action='close']")) observer.disconnect();
      });
    }
  }

  function handlePageAction(
    action
  ) {
    switch (action) {

      case "read-bible": openBibleReader(); break;
      case "open-music":
        if (window.__apostolicSongs && window.__apostolicSongs.length) {
          openMusicPlayer(window.__apostolicSongs[0]);
        } else {
          toast("No playable songs are available yet. Upload a song first.","info");
        }
        break;
      case "shorts": openShortsFeed(window.__apostolicShorts || []); break;
      case "create-post":
        requireCreatorAuth(function () {
          showCommunityPostForm();
        });
        break;

      case "ask-question":
        showQuestionForm();
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

      case "create-folder":
        requireCreatorAuth(function () { showFolderForm(); });
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

  async function handleUploadSubmit(form) {
    const data=new FormData(form), title=String(data.get("title")||"").trim(), description=String(data.get("description")||"").trim();
    const files=data.getAll("file").filter(f=>f&&f.name), type=form.dataset.uploadForm||"document";
    const status=form.querySelector(".upload-status"), button=form.querySelector("[data-upload-submit]");
    const progress=p=>{const n=Math.max(0,Math.min(100,Math.round(p))); if(status){status.hidden=false;status.textContent=n+"%";} if(button) button.textContent=n+"%";};
    const auth=window.ApostolicAuth, user=auth?.getUser?.();
    if(!auth?.isLoggedIn?.()||!user){toast("Please sign in before uploading content.","error");return;}
    if(!files.length){toast("Please select at least one file.","error");return;}
    if(files.length>12){toast("You can upload a maximum of 12 files at once.","error");return;}
    const api=window.ApostolicSupabase, config=window.ApostolicConfig||window.APP_CONFIG||{}, bucket=(config.UPLOADS&&config.UPLOADS.BUCKET)||"Apostolic_Media";
    if(!api?.isConfigured?.()){toast("Supabase is not configured.","error");return;}
    if(button) button.disabled=true; progress(0);
    let done=0,failed=0;
    for(const file of files){
      try{
        const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_").replace(/_+/g,"_");
        const path=type+"/"+Date.now()+"-"+Math.random().toString(36).slice(2,8)+"-"+safe;
        const up=await api.uploadFile(bucket,path,file,{upsert:false});
        if(up?.error) throw up.error;
        const url=api.getPublicUrl(bucket,path); if(!url) throw new Error("Could not create the file URL.");
        const base=title||file.name.replace(/\.[^.]+$/,"");
        const itemTitle=files.length>1?base+" "+(done+failed+1):base;
        const db=await api.insert("media_uploads",{title:itemTitle,description,type,user_id:user.id,file_name:file.name,file_path:path,file_url:url,file_size:file.size,file_type:file.type||null});
        if(db?.error) throw db.error;
        done++;
      }catch(e){failed++;console.error("Upload item failed:",e);}
      progress(((done+failed)/files.length)*100);
    }
    progress(100);
    if(!done){toast("Upload failed.","error");if(button){button.disabled=false;button.textContent="Upload";}return;}
    closeDynamicModal(form.closest(".apostolic-modal"));
    toast(done+" file"+(done===1?"":"s")+" uploaded successfully"+(failed?". "+failed+" failed.":"."),failed?"info":"success");
    refreshCurrentMediaPage();
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

  function isCurrentRoute(route) {
    const current = (window.location.hash || "#home").replace(/^#/, "").split("?")[0];
    return current === String(route || "home").replace(/^#/, "").split("?")[0];
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

  function renderEngagementActions(contentType, contentId, fileUrl = "", contentKind = "") {
    const id=escapeHTML(contentId), type=escapeHTML(contentType), song=contentKind==="song";
    const comment=song?"":'<button type="button" class="btn" data-content-action="comments" data-content-type="'+type+'" data-content-id="'+id+'" data-content-title="Content">💬 Comment</button>';
    const love=song?"":'<button type="button" class="btn" data-content-action="love" data-content-type="'+type+'" data-content-id="'+id+'">❤️ Love</button>';
    const share='<button type="button" class="btn" data-content-action="share" data-content-type="'+type+'" data-content-id="'+id+'">↗ Share</button>';
    const like='<button type="button" class="btn" data-content-action="like" data-content-type="'+type+'" data-content-id="'+id+'">👍 Like</button>';
    return '<div class="card-actions feed-reactions">'+comment+like+love+share+'</div>';
  }

  async function showComments(contentType, contentId, title) {
    const api=window.ApostolicSupabase;
    if(!api?.isConfigured?.()){toast("Supabase is not configured.","error");return;}
    try{
      const filter=contentType==="community_post"?{post_id:contentId}:{media_id:contentId};
      const result=await api.select("comments","*",{eq:filter,order:{column:"created_at",ascending:true},limit:100});
      const comments=result?.data||[];
      const list=comments.length?comments.map(item=>renderCard("💬","Comment",item.content,"")).join(""):renderCard("💬","No Comments","Be the first to comment.");
      const form=currentUser()?'<form class="dynamic-form" data-comment-form data-comment-id="'+escapeHTML(contentId)+'" data-comment-type="'+escapeHTML(contentType)+'"><textarea name="content" rows="3" required placeholder="Write a comment..."></textarea><button type="submit" class="btn primary">Comment</button></form>':'<p>Please sign in to comment.</p>';
      createModal("Comments: "+title,'<section class="content-grid">'+list+'</section>'+form);
    }catch(e){console.error("Comments failed:",e);toast("Could not load comments.","error");}
  }

  async function loadSavedContent() {
    const container = $(".page-container"), user = currentUser(), api = window.ApostolicSupabase;
    if (!container || !user || !api || !api.isConfigured()) return;
    try {
      const saved = await api.select("saved_content", "*", { eq: { user_id: user.id }, order: { column: "created_at", ascending: false }, limit: 100 });
      if (!isCurrentRoute("saved")) return;
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
      if (!isCurrentRoute("notifications")) return;
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
      if (!isCurrentRoute("profile")) return;
      const profile = result?.data?.[0] || {};
      const avatar = profile.avatar_url
        ? '<img src="' + escapeHTML(profile.avatar_url) + '" alt="Profile photo" style="width:120px;height:120px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 1rem">'
        : '<div style="width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:3rem;background:var(--surface-2,#eee)">👤</div>';
      container.insertAdjacentHTML("beforeend",
        '<section class="content-grid">' +
          '<article class="card" style="text-align:center">' + avatar +
            '<h3>' + escapeHTML(profile.full_name || user.email || "User") + '</h3>' +
            '<p>' + escapeHTML(user.email || "") + '</p>' +
            '<p>Role: ' + escapeHTML(profile.role || "user") + '</p>' +
            '<button type="button" class="btn" data-page-action="sign-out">Sign Out</button>' +
          '</article>' +
          '<article class="card"><h3>Edit Profile</h3>' +
            '<form class="dynamic-form" data-profile-form enctype="multipart/form-data">' +
              '<div class="form-group"><label>Full name</label><input name="full_name" value="' + escapeHTML(profile.full_name || "") + '" placeholder="Full name"></div>' +
              '<div class="form-group"><label>Profile photo</label><input name="avatar" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></div>' +
              '<small>JPG, PNG, WebP or GIF. Maximum 5 MB.</small>' +
              '<button type="submit" class="btn primary">Save Profile</button>' +
            '</form>' +
          '</article>' +
        '</section>');
    } catch (error) { console.error("Profile failed:", error); }
  }

  async function loadQA() {
    const container = $(".page-container"), api = window.ApostolicSupabase;
    if (!container || !api || !api.isConfigured()) return;
    try {
      const result = await api.select("questions", "*", { order: { column: "created_at", ascending: false }, limit: 50 });
      if (!isCurrentRoute("qa")) return;
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
<section class="home-hero"><div class="home-hero-copy"><span class="home-kicker">✦ APOSTOLIC MEDIA</span><h1>Grow in the Word.<br><span>Worship. Learn. Connect.</span></h1><p>Your Christian home for Scripture, worship music, sermons, teachings and a growing Apostolic community.</p><div class="home-hero-actions"><a class="home-primary-btn" href="#bible">📖 Read the Bible</a><a class="home-secondary-btn" href="#songs">▶ Start Listening</a></div></div><div class="home-hero-art"><div class="home-orbit home-orbit-one"></div><div class="home-orbit home-orbit-two"></div><div class="home-cross">✝</div></div></section>
<section class="home-quick-row"><a href="#bible" class="home-quick-card"><span>📖</span><strong>Bible</strong><small>Read Scripture</small></a><a href="#songs" class="home-quick-card"><span>🎵</span><strong>Music</strong><small>Worship &amp; praise</small></a><a href="#sermons" class="home-quick-card"><span>🎙️</span><strong>Sermons</strong><small>Listen &amp; grow</small></a><a href="#videos" class="home-quick-card"><span>▶</span><strong>Short Videos</strong><small>Watch &amp; discover</small></a><a href="#bible-study" class="home-quick-card"><span>📚</span><strong>Study</strong><small>Go deeper</small></a><a href="#community" class="home-quick-card"><span>👥</span><strong>Community</strong><small>Connect together</small></a></section>
<section class="home-section"><div class="home-section-head"><div><span class="home-section-kicker">FOR YOU</span><h2>Continue your journey</h2></div><a href="#bible">See all →</a></div><div class="home-continue"><article class="home-continue-card"><div class="home-continue-icon">📖</div><div><span class="home-label">BIBLE READING</span><h3>Continue in the Word</h3><p>Pick up where your Scripture journey begins.</p></div><a class="home-round-btn" href="#bible">▶</a></article><article class="home-continue-card music"><div class="home-continue-icon">🎧</div><div><span class="home-label">WORSHIP MUSIC</span><h3>Listen and worship</h3><p>Discover songs that lift your heart to God.</p></div><a class="home-round-btn" href="#songs">▶</a></article></div></section>
<section class="home-section"><div class="home-section-head"><div><span class="home-section-kicker">DISCOVER</span><h2>Featured today</h2></div><a href="#teachings">Explore →</a></div><div class="home-feature-grid"><a class="home-feature-card feature-bible" href="#bible"><span class="home-feature-icon">📖</span><div><span>HOLY SCRIPTURE</span><h3>Read the Bible</h3><p>Find truth, hope and life in Gods Word.</p></div></a><a class="home-feature-card feature-music" href="#songs"><span class="home-feature-icon">🎵</span><div><span>WORSHIP</span><h3>Christian Music</h3><p>Sing, listen and worship wherever you are.</p></div></a><a class="home-feature-card feature-teaching" href="#teachings"><span class="home-feature-icon">🎓</span><div><span>LEARN</span><h3>Teachings</h3><p>Build your faith through Christian teaching.</p></div></a></div></section>
<section class="home-section"><div class="home-section-head"><div><span class="home-section-kicker">WATCH</span><h2>Short Christian videos</h2></div><a href="#videos">View all →</a></div><div class="home-shorts-row"><a href="#videos" class="home-short-card short-one"><span>▶</span><div><b>Faith for today</b><small>Watch a short message</small></div></a><a href="#videos" class="home-short-card short-two"><span>▶</span><div><b>Word of encouragement</b><small>1 minute • Christian</small></div></a><a href="#videos" class="home-short-card short-three"><span>▶</span><div><b>Worship moment</b><small>Listen • Pray • Worship</small></div></a><a href="#videos" class="home-short-card short-four"><span>▶</span><div><b>Bible truth</b><small>Scripture in focus</small></div></a></div></section>
<section class="home-section home-community-banner"><div><span class="home-section-kicker">COMMUNITY</span><h2>Faith grows better together.</h2><p>Share, ask questions, learn from one another and stay connected with the Apostolic community.</p></div><a class="home-primary-btn" href="#community">Join Community →</a></section>
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
          "Read, search and continue your Scripture journey.",
          renderAction("Open Bible Reader","read-bible")
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
        ${renderPageHero("Teachings", "Christian teachings, Bible lessons and written resources.")}
      `
    },

    /* -------------------------------------------------------
       SERMONS
       ------------------------------------------------------- */

    sermons: {
      title: "Sermons",

      content: `
        ${renderPageHero("Sermons", "Listen to Christian sermons and messages.")}
      `
    },

    /* -------------------------------------------------------
       SONGS
       ------------------------------------------------------- */

    songs: {
      title: "Songs",

      content: `
        ${renderPageHero("Songs", "Christian worship songs and music.")}
      `
    },

    /* -------------------------------------------------------
       LYRICS
       ------------------------------------------------------- */

    lyrics: {
      title: "Lyrics",

      content: `
        ${renderPageHero("Lyrics", "Read Christian song lyrics.")}
      `
    },

    /* -------------------------------------------------------
       VIDEOS
       ------------------------------------------------------- */

    videos: {
      title: "Videos",

      content: `
        ${renderPageHero("Videos", "Watch Christian videos, teachings and sermons.")}
      `
    },

    /* -------------------------------------------------------
       COMMUNITY
       ------------------------------------------------------- */

    community: {
      title: "Community",

      content: `
        ${renderPageHero("Community", "Connect, encourage one another and grow together.", renderAction("Create Post","create-post"))}
      `
    },

    /* -------------------------------------------------------
       Q&A
       ------------------------------------------------------- */

    qa: {
      title: "Bible Q&A",

      content: `
        ${renderPageHero("Bible Q&A", "Ask questions and explore biblical answers.", renderAction("Ask a Question","ask-question"))}
      `
    },

    /* -------------------------------------------------------
       EVENTS
       ------------------------------------------------------- */

    events: {
      title: "Events",

      content: `
        ${renderPageHero("Events", "Christian events, meetings and programs.", renderAction("Create Event","create-event"))}
      `
    },

    /* -------------------------------------------------------
       PLAYLISTS
       ------------------------------------------------------- */

    folders: {
      title: "Folders",
      content: `
        ${renderPageHero("Folders", "Organize Christian resources into your own collections.", renderAction("Create Folder","create-folder"))}
      `
    },

    playlists: {
      title: "Playlists",

      content: `
        ${renderPageHero("Playlists", "Create and organize your favorite Christian media.", renderAction("Create Playlist","create-playlist"))}
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
        ${renderPageHero("Courses", "Learn through structured Christian courses.")}
      `
    },

    "bible-study": {
      title: "Bible Study",
      content: `
        ${renderPageHero("Bible Study", "Study the Word through Bible lessons and resources.")}
      `
    },

    /* -------------------------------------------------------
       PROFILE
       ------------------------------------------------------- */

    profile: {
      title: "Profile",

      content: `
        ${renderPageHero("Profile", "Manage your Apostolic Media profile.", renderAction("Sign In / Create Account","sign-in"))}
      `
    },

    /* -------------------------------------------------------
       NOTIFICATIONS
       ------------------------------------------------------- */

    notifications: {
      title: "Notifications",

      content: `
        ${renderPageHero("Notifications", "Stay informed about new Christian content and activity.", "")}
      `
    },

    /* -------------------------------------------------------
       DOWNLOADS
       ------------------------------------------------------- */

    downloads: {
      title: "Downloads",

      content: `
        ${renderPageHero("Downloads", "Access content you have downloaded.", "")}
      `
    },

    /* -------------------------------------------------------
       SAVED
       ------------------------------------------------------- */

    saved: {
      title: "Saved",

      content: `
        ${renderPageHero("Saved", "Access the Christian content you saved.", "")}
      `
    },

    /* -------------------------------------------------------
       CREATOR STUDIO
       ------------------------------------------------------- */

    creator: {
      title: "Creator Studio",

      content: `
        ${renderPageHero("Creator Studio", "Create, upload and manage your Christian content.", "")}
      `
    },

    /* -------------------------------------------------------
       ADMIN
       ------------------------------------------------------- */

    admin: {
      title: "Admin",

      content: `
        ${renderPageHero("Admin", "Manage content and platform activity.", "")}
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
      if (!isCurrentRoute("events")) return;
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
      if (!isCurrentRoute("playlists")) return;
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
      if (!isCurrentRoute("admin")) return;
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
      if (!isCurrentRoute("creator")) return;
      const items = result?.data || [];
      const counts = {};
      items.forEach(function(item){ counts[item.type] = (counts[item.type] || 0) + 1; });
      const summary = '<section class="content-grid">' +
        renderCard("📊", "My Content", String(items.length) + " published/uploaded items.") +
        renderCard("✏️", "Editable", "Your own items can be edited or deleted.") +
        renderCard("📁", "Content Types", String(Object.keys(counts).length) + " types in your library.") +
        '</section>';
      const creatorTools = '<section class="creator-tools"><div><span class="home-section-kicker">CREATOR TOOLS</span><h2>Create or upload</h2><p>Choose a content type. Upload supports up to 12 files at once.</p></div><div class="creator-tools-grid">' +
        '<button type="button" class="btn primary" data-page-action="create-teaching">✍️ Create Teaching</button>' +
        '<button type="button" class="btn primary" data-page-action="create-sermon">🎙️ Create Sermon</button>' +
        '<button type="button" class="btn primary" data-page-action="create-song">🎵 Create Song</button>' +
        '<button type="button" class="btn primary" data-page-action="create-course">🎓 Create Course</button>' +
        '<button type="button" class="btn" data-page-action="upload-teaching">⬆️ Upload Teaching</button>' +
        '<button type="button" class="btn" data-page-action="upload-sermon">⬆️ Upload Sermon</button>' +
        '<button type="button" class="btn" data-page-action="upload-song">⬆️ Upload Song</button>' +
        '<button type="button" class="btn" data-page-action="upload-video">⬆️ Upload Video</button>' +
        '<button type="button" class="btn" data-page-action="upload-document">⬆️ Upload Document</button>' +
        '</div></section>';
      const cards = items.map(function(item) {
        const actions = (item.file_url ? '<button type="button" class="btn" data-open-media="' + escapeHTML(item.id) + '">Open in app</button>' : '') +
          contentActionButtons("media_upload", item.id, item.user_id);
        return renderCard("📝", item.title || item.file_name || "Untitled", item.description || "", actions);
      }).join("");
      container.insertAdjacentHTML("beforeend", summary + creatorTools + '<section class="content-grid">
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
      if (!isCurrentRoute("downloads")) return;
      const rows = result?.data || [];
      const cards = rows.map(function(row) {
        return renderCard("⇩", row.content_type || "Download", "Downloaded content: " + String(row.content_id || ""));
      }).join("");
      container.insertAdjacentHTML("beforeend", '<section class="content-grid">' +
        (cards || renderCard("⇩", "No Downloads Yet", "Your downloaded resources will appear here.")) + '</section>');
    } catch(error) { console.error("Downloads failed:", error); }
  }

  function renderFeedItem(item, profile = {}, options = {}) {
    const title=item.title||item.file_name||"Untitled", description=item.description||item.content||"";
    const name=profile.full_name||(item.user_id?"Apostolic Media Member":"Apostolic Media");
    const initial=name.trim().charAt(0).toUpperCase()||"A";
    const avatar=profile.avatar_url?'<img class="feed-avatar" src="'+escapeHTML(profile.avatar_url)+'" alt="" loading="lazy">':'<span class="feed-avatar feed-avatar-fallback">'+escapeHTML(initial)+'</span>';
    const media=item.file_url?(item.type==="video"?'<video class="feed-video" controls preload="metadata" src="'+escapeHTML(item.file_url)+'"></video>':item.type==="song"?'<audio class="feed-audio" controls preload="metadata" src="'+escapeHTML(item.file_url)+'"></audio>':""):"";
    let actions="";
    if(options.community){
      actions=renderEngagementActions("community_post",item.id,"",item.type);
    }else{
      const special=item.type==="song"&&item.file_url?'<button type="button" class="btn primary" data-media-play="'+escapeHTML(item.id)+'">▶ Play</button>':item.type==="video"&&item.file_url?'<button type="button" class="btn primary" data-media-short="'+escapeHTML(item.id)+'">▶ Watch</button>':"";
      const open=item.file_url?'<button type="button" class="btn" data-open-media="'+escapeHTML(item.id)+'">Open in app</button>':"";
      actions=special+open+renderEngagementActions("media_upload",item.id,item.file_url||"",item.type)+contentActionButtons("media_upload",item.id,item.user_id||null);
    }
    return '<article class="social-feed-item"><header class="feed-author">'+avatar+'<div><strong>'+escapeHTML(name)+'</strong><span>'+(item.created_at?new Date(item.created_at).toLocaleDateString():"Apostolic Media")+'</span></div></header><div class="feed-body"><div class="feed-type">'+escapeHTML(options.label||item.type||"Christian Content")+'</div><h3>'+escapeHTML(title)+'</h3>'+(description?'<p class="feed-post-text">'+escapeHTML(description)+'</p>':"")+media+'</div><div class="feed-actions">'+actions+'</div></article>';
  }

  async function loadMediaForPage(route) {
    const types = mediaRouteTypes[route];
    if (!Array.isArray(types) || !types.length) return;
    const container = $(".page-container");
    if (!container) return;
    const section = document.createElement("section");
    section.className = "social-feed";
    section.innerHTML = '<article class="social-feed-item feed-loading"><div class="feed-body"><p>Loading content...</p></div></article>';
    container.appendChild(section);

    let uploaded = [], uploadError = null;
    const profiles = {};
    try {
      const api = window.ApostolicSupabase;
      if (api && api.isConfigured()) {
        const result = await api.select("media_uploads", "*", { order: { column: "created_at", ascending: false }, limit: 100 });
        if (!isCurrentRoute(route)) return;
        uploaded = Array.isArray(result?.data) ? result.data.filter(item => item && types.includes(item.type)) : [];
        uploadError = result?.error || null;
        const ids = [...new Set(uploaded.map(item => item.user_id).filter(Boolean))];
        if (ids.length) {
          const pr = await api.select("profiles", "id,full_name,avatar_url", { in: { id: ids } });
          (pr?.data || []).forEach(profile => { profiles[String(profile.id)] = profile; });
        }
      }
    } catch (error) { uploadError = error; }

    const localItems = storage.get("apostolic_created_items", []).filter(item =>
      item && types.includes(item.type) &&
      !uploaded.some(remote => remote && remote.type === item.type && remote.title === item.title)
    );
    window.__apostolicMediaById = window.__apostolicMediaById || {};
    if (route === "videos") window.__apostolicShorts = uploaded.filter(item => item.file_url);
    if (route === "songs") window.__apostolicSongs = uploaded.filter(item => item.file_url);

    const feedItems = uploaded.map(item => {
      window.__apostolicMediaById[String(item.id)] = item;
      return renderFeedItem(item, profiles[String(item.user_id)] || {}, {
        label: route === "bible-study" ? "Bible Study" : route === "courses" ? "Course" : route.slice(0,1).toUpperCase() + route.slice(1)
      });
    });
    localItems.forEach(item => {
      window.__apostolicMediaById[String(item.id)] = item;
      feedItems.push(renderFeedItem(item, {}, { label: route }));
    });

    if (uploadError && !feedItems.length) {
      feedItems.push('<article class="social-feed-item"><div class="feed-body"><h3>Could not load content</h3><p>Please refresh and try again.</p></div></article>');
    } else if (!feedItems.length) {
      feedItems.push('<article class="social-feed-item"><div class="feed-body"><h3>No content yet</h3><p>Content you create or upload will appear here.</p></div></article>');
    }
    section.innerHTML = feedItems.join("");
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

    initMiniPlayer();

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
