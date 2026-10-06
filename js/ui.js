/* =========================================================
   Apostolic Media
   User Interface Utilities
   File: js/ui.js
   ========================================================= */

(function (window) {
  "use strict";

  const UI = {

    // =======================================================
    // Selectors
    // =======================================================

    $: function (selector, parent) {
      return (parent || document).querySelector(selector);
    },

    $$: function (selector, parent) {
      return Array.from(
        (parent || document).querySelectorAll(selector)
      );
    },

    // =======================================================
    // Create element
    // =======================================================

    create: function (tag, options) {
      const element = document.createElement(tag);

      options = options || {};

      if (options.className) {
        element.className = options.className;
      }

      if (options.id) {
        element.id = options.id;
      }

      if (options.text !== undefined) {
        element.textContent = options.text;
      }

      if (options.html !== undefined) {
        element.innerHTML = options.html;
      }

      if (options.attributes) {
        Object.keys(options.attributes).forEach(function (key) {
          element.setAttribute(
            key,
            options.attributes[key]
          );
        });
      }

      if (options.dataset) {
        Object.keys(options.dataset).forEach(function (key) {
          element.dataset[key] = options.dataset[key];
        });
      }

      return element;
    },

    // =======================================================
    // Show element
    // =======================================================

    show: function (element) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.hidden = false;
      element.removeAttribute("aria-hidden");
      element.classList.remove("hidden");
    },

    // =======================================================
    // Hide element
    // =======================================================

    hide: function (element) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
      element.classList.add("hidden");
    },

    // =======================================================
    // Toggle element
    // =======================================================

    toggle: function (element, force) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      if (typeof force === "boolean") {
        force ? this.show(element) : this.hide(element);
        return;
      }

      if (element.hidden) {
        this.show(element);
      } else {
        this.hide(element);
      }
    },

    // =======================================================
    // Add class
    // =======================================================

    addClass: function (element, className) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.classList.add(className);
    },

    // =======================================================
    // Remove class
    // =======================================================

    removeClass: function (element, className) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.classList.remove(className);
    },

    // =======================================================
    // Toggle class
    // =======================================================

    toggleClass: function (
      element,
      className,
      force
    ) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      return element.classList.toggle(
        className,
        force
      );
    },

    // =======================================================
    // Set text
    // =======================================================

    setText: function (element, text) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.textContent =
        text !== undefined ? text : "";
    },

    // =======================================================
    // Set HTML
    // =======================================================

    setHTML: function (element, html) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.innerHTML =
        html !== undefined ? html : "";
    },

    // =======================================================
    // Clear element
    // =======================================================

    clear: function (element) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.innerHTML = "";
    },

    // =======================================================
    // Loading indicator
    // =======================================================

    loading: function (
      element,
      message
    ) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.innerHTML = `
        <div class="ui-loading" role="status">
          <div class="ui-spinner"></div>
          <span>
            ${message || "Loading..."}
          </span>
        </div>
      `;
    },

    // =======================================================
    // Empty state
    // =======================================================

    empty: function (
      element,
      message,
      icon
    ) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.innerHTML = `
        <div class="ui-empty-state">
          <div class="ui-empty-icon">
            ${icon || "📭"}
          </div>
          <p>
            ${message || "No content available."}
          </p>
        </div>
      `;
    },

    // =======================================================
    // Error state
    // =======================================================

    error: function (
      element,
      message
    ) {
      if (!element) return;

      if (typeof element === "string") {
        element = this.$(element);
      }

      if (!element) return;

      element.innerHTML = `
        <div class="ui-error-state">
          <div class="ui-error-icon">⚠️</div>
          <p>
            ${message || "Something went wrong."}
          </p>
          <button
            type="button"
            class="btn primary"
            data-ui-retry
          >
            Try Again
          </button>
        </div>
      `;
    },

    // =======================================================
    // Toast notification
    // =======================================================

    toast: function (
      message,
      type,
      duration
    ) {
      type = type || "info";
      duration =
        duration ||
        (
          window.ApostolicConfig &&
          window.ApostolicConfig.NOTIFICATIONS
        )?.DEFAULT_DURATION ||
        4000;

      let container =
        document.querySelector(
          ".toast-container"
        );

      if (!container) {
        container =
          document.createElement("div");

        container.className =
          "toast-container";

        container.setAttribute(
          "aria-live",
          "polite"
        );

        document.body.appendChild(container);
      }

      const toast =
        document.createElement("div");

      toast.className =
        "toast toast-" + type;

      toast.setAttribute(
        "role",
        "status"
      );

      toast.innerHTML = `
        <span class="toast-message"></span>
        <button
          type="button"
          class="toast-close"
          aria-label="Close"
        >
          ×
        </button>
      `;

      toast.querySelector(
        ".toast-message"
      ).textContent = message;

      toast.querySelector(
        ".toast-close"
      ).addEventListener(
        "click",
        function () {
          UI.removeToast(toast);
        }
      );

      container.appendChild(toast);

      requestAnimationFrame(function () {
        toast.classList.add("show");
      });

      setTimeout(function () {
        UI.removeToast(toast);
      }, duration);

      return toast;
    },

    // =======================================================
    // Remove toast
    // =======================================================

    removeToast: function (toast) {
      if (!toast) return;

      toast.classList.remove("show");

      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    },

    // =======================================================
    // Modal
    // =======================================================

    modal: function (
      title,
      content,
      options
    ) {
      options = options || {};

      const overlay =
        document.createElement("div");

      overlay.className =
        "ui-modal-overlay";

      overlay.innerHTML = `
        <div
          class="ui-modal"
          role="dialog"
          aria-modal="true"
          aria-label="${title || "Dialog"}"
        >
          <div class="ui-modal-header">
            <h2></h2>
            <button
              type="button"
              class="ui-modal-close"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div class="ui-modal-body"></div>

          ${
            options.footer
              ? `
                <div class="ui-modal-footer">
                  ${options.footer}
                </div>
              `
              : ""
          }
        </div>
      `;

      const modal =
        overlay.querySelector(
          ".ui-modal"
        );

      const titleElement =
        overlay.querySelector(
          "h2"
        );

      const body =
        overlay.querySelector(
          ".ui-modal-body"
        );

      titleElement.textContent =
        title || "";

      if (
        content instanceof Node
      ) {
        body.appendChild(content);
      } else {
        body.innerHTML =
          content || "";
      }

      const close =
        function () {
          UI.closeModal(overlay);
        };

      overlay
        .querySelector(
          ".ui-modal-close"
        )
        .addEventListener(
          "click",
          close
        );

      overlay.addEventListener(
        "click",
        function (event) {
          if (
            event.target === overlay &&
            options.closeOnBackdrop !== false
          ) {
            close();
          }
        }
      );

      document.body.appendChild(
        overlay
      );

      document.body.classList.add(
        "modal-open"
      );

      requestAnimationFrame(function () {
        overlay.classList.add("show");
      });

      if (options.closeOnEscape !== false) {
        overlay._escapeHandler =
          function (event) {
            if (
              event.key === "Escape"
            ) {
              close();
            }
          };

        document.addEventListener(
          "keydown",
          overlay._escapeHandler
        );
      }

      setTimeout(function () {
        modal.focus();
      }, 0);

      return overlay;
    },

    // =======================================================
    // Close modal
    // =======================================================

    closeModal: function (modal) {
      if (!modal) return;

      modal.classList.remove(
        "show"
      );

      if (modal._escapeHandler) {
        document.removeEventListener(
          "keydown",
          modal._escapeHandler
        );
      }

      setTimeout(function () {
        if (modal.parentNode) {
          modal.parentNode.removeChild(
            modal
          );
        }

        document.body.classList.remove(
          "modal-open"
        );
      }, 200);
    },

    // =======================================================
    // Confirm dialog
    // =======================================================

    confirm: function (
      message,
      onConfirm,
      onCancel
    ) {
      const modal =
        this.modal(
          "Confirmation",
          `
            <p class="ui-confirm-message">
              ${message || "Are you sure?"}
            </p>

            <div class="ui-confirm-actions">
              <button
                type="button"
                class="btn secondary"
                data-confirm-cancel
              >
                Cancel
              </button>

              <button
                type="button"
                class="btn primary"
                data-confirm-ok
              >
                Confirm
              </button>
            </div>
          `
        );

      modal
        .querySelector(
          "[data-confirm-cancel]"
        )
        .addEventListener(
          "click",
          function () {
            UI.closeModal(modal);

            if (
              typeof onCancel ===
              "function"
            ) {
              onCancel();
            }
          }
        );

      modal
        .querySelector(
          "[data-confirm-ok]"
        )
        .addEventListener(
          "click",
          function () {
            UI.closeModal(modal);

            if (
              typeof onConfirm ===
              "function"
            ) {
              onConfirm();
            }
          }
        );

      return modal;
    },

    // =======================================================
    // Scroll to top
    // =======================================================

    scrollTop: function (
      smooth
    ) {
      window.scrollTo({
        top: 0,
        behavior:
          smooth === false
            ? "auto"
            : "smooth"
      });
    },

    // =======================================================
    // Format time
    // =======================================================

    formatTime: function (
      seconds
    ) {
      seconds =
        Number(seconds) || 0;

      const minutes =
        Math.floor(
          seconds / 60
        );

      const remaining =
        Math.floor(
          seconds % 60
        );

      return (
        String(minutes) +
        ":" +
        String(
          remaining
        ).padStart(2, "0")
      );
    },

    // =======================================================
    // Format number
    // =======================================================

    formatNumber: function (
      number
    ) {
      const value =
        Number(number);

      if (
        !Number.isFinite(value)
      ) {
        return "0";
      }

      return value.toLocaleString();
    },

    // =======================================================
    // Escape HTML
    // =======================================================

    escapeHTML: function (
      value
    ) {
      const div =
        document.createElement(
          "div"
        );

      div.textContent =
        value == null
          ? ""
          : String(value);

      return div.innerHTML;
    },

    // =======================================================
    // Debounce
    // =======================================================

    debounce: function (
      callback,
      delay
    ) {
      let timer;

      return function () {
        const context = this;
        const args = arguments;

        clearTimeout(timer);

        timer = setTimeout(
          function () {
            callback.apply(
              context,
              args
            );
          },
          delay || 300
        );
      };
    },

    // =======================================================
    // Throttle
    // =======================================================

    throttle: function (
      callback,
      delay
    ) {
      let waiting = false;

      return function () {
        if (waiting) {
          return;
        }

        const context = this;
        const args = arguments;

        waiting = true;

        callback.apply(
          context,
          args
        );

        setTimeout(
          function () {
            waiting = false;
          },
          delay || 100
        );
      };
    },

    // =======================================================
    // Disable button while processing
    // =======================================================

    setButtonLoading: function (
      button,
      loading,
      text
    ) {
      if (!button) return;

      if (
        typeof button ===
        "string"
      ) {
        button =
          this.$(button);
      }

      if (!button) return;

      if (loading) {
        button.dataset.originalText =
          button.textContent;

        button.disabled = true;

        button.innerHTML =
          `<span class="button-spinner"></span> ${
            text || "Loading..."
          }`;
      } else {
        button.disabled = false;

        if (
          button.dataset
            .originalText
        ) {
          button.textContent =
            button.dataset
              .originalText;
        }
      }
    },

    // =======================================================
    // Initialize UI
    // =======================================================

    init: function () {

      // Close elements marked with data-ui-close
      document.addEventListener(
        "click",
        function (event) {
          const closeButton =
            event.target.closest(
              "[data-ui-close]"
            );

          if (!closeButton) {
            return;
          }

          const selector =
            closeButton.getAttribute(
              "data-ui-close"
            );

          if (selector) {
            UI.hide(selector);
          }
        }
      );

      // Retry buttons
      document.addEventListener(
        "click",
        function (event) {
          const retry =
            event.target.closest(
              "[data-ui-retry]"
            );

          if (!retry) {
            return;
          }

          window.dispatchEvent(
            new CustomEvent(
              "uiRetry"
            )
          );
        }
      );

      // Back-to-top button
      const backTop =
        document.querySelector(
          "[data-back-to-top]"
        );

      if (backTop) {
        backTop.addEventListener(
          "click",
          function () {
            UI.scrollTop();
          }
        );
      }

      // Show/hide back-to-top
      window.addEventListener(
        "scroll",
        UI.throttle(
          function () {
            if (!backTop) {
              return;
            }

            UI.toggleClass(
              backTop,
              "visible",
              window.scrollY > 400
            );
          },
          100
        )
      );
    }
  };

  // =========================================================
  // Public global object
  // =========================================================

  window.ApostolicUI = UI;

  // Compatibility alias
  window.UI = UI;

  // =========================================================
  // Initialize
  // =========================================================

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        UI.init();
      }
    );
  } else {
    UI.init();
  }

})(window);
