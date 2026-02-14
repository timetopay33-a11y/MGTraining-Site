(function () {
  const KEY = "mgtraining_welcome_seen_v2";
  const VIDEO_URL = "https://media.mgtraining.net/welcome/intro-01.mp4";

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
  width: min(900px, 95%);
  background: var(--md-default-bg-color, #111);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,.5);
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
        <video class="welcome-video-player" controls playsinline>
          <source src="https://mgtraining.net/Welcome.mp4" type="video/mp4">
        </video>
      </div>
    `;

    document.body.appendChild(overlay);

    const video = overlay.querySelector("video");

    // Attempt autoplay (muted required in most browsers)
    video.muted = true;
    video.play().catch(() => {});

    // When video ends, close modal and mark as seen
    video.addEventListener("ended", () => {
      overlay.remove();
      markSeen();
    });
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
