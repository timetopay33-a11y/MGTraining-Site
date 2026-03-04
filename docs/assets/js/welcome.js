(function () {
  const KEY = "mgtraining_welcome_seen_v2";
  const VIDEO_URL = "https://mgtraining.net/Welcome.mp4";

  function alreadySeen() {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  }

  function markSeen() {
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  function injectStyles() {
    if (document.getElementById("welcome-video-styles")) return;

    const style = document.createElement("style");
    style.id = "welcome-video-styles";
    style.textContent = `
#welcome-video-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.welcome-video-modal {
  position: relative;
  width: min(900px, 95%);
  background: var(--md-default-bg-color, #111);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,.5);
}

.welcome-video-close {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 10;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.welcome-video-close:hover {
  background: rgba(0,0,0,0.8);
}

.welcome-video-error {
  padding: 2rem;
  text-align: center;
  color: var(--md-default-fg-color, #eee);
  font-size: 0.95rem;
}

.welcome-video-player {
  width: 100%;
  display: block;
  background: #000;
}
    `;
    document.head.appendChild(style);
  }

  function showModal() {
    if (document.getElementById("welcome-video-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "welcome-video-overlay";
    overlay.innerHTML = `
      <div class="welcome-video-modal">
        <button class="welcome-video-close" aria-label="Close welcome video">✕</button>
        <video class="welcome-video-player" controls playsinline>
          <source src="${VIDEO_URL}" type="video/mp4">
        </video>
      </div>
    `;

    document.body.appendChild(overlay);

    const video = overlay.querySelector("video");
    const closeBtn = overlay.querySelector(".welcome-video-close");

    function closeModal() {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
      markSeen();
    }

    function escHandler(e) {
      if (e.key === "Escape") closeModal();
    }

    // Close on button click
    closeBtn.addEventListener("click", closeModal);

    // Close on Escape key
    document.addEventListener("keydown", escHandler);

    // Close on backdrop click (outside the modal card)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // Close when video ends naturally
    video.addEventListener("ended", closeModal);

    // If the video fails to load, swap in a readable message
    video.addEventListener("error", () => {
      video.replaceWith(Object.assign(document.createElement("div"), {
        className: "welcome-video-error",
        textContent: "Welcome video unavailable. Click ✕ or press Escape to continue."
      }));
    });

    // Attempt autoplay (muted required in most browsers)
    video.muted = true;
    video.play().catch(() => {});
  }

  function run() {
    if (alreadySeen()) return;
    injectStyles();
    showModal();
  }

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // MkDocs Material instant navigation support
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => run());
  }
})();