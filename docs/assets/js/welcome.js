(function () {
  const KEY = "mgtraining_welcome_seen_v1";

  function isDocsSite() {
    // Optional: only run on docs.mgtraining.net
    return location.hostname.endsWith("mgtraining.net");
  }

  function alreadySeen() {
    try { return localStorage.getItem(KEY) === "1"; } catch { return true; }
  }

  function markSeen() {
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  function buildModal() {
    const overlay = document.createElement("div");
    overlay.id = "welcome-video-overlay";
    overlay.innerHTML = `
      <div class="welcome-video-modal" role="dialog" aria-modal="true" aria-label="Welcome video">
        <div class="welcome-video-header">
          <div class="welcome-video-title">Welcome</div>
          <button class="welcome-video-close" type="button" aria-label="Close">✕</button>
        </div>
        <video class="welcome-video-player" controls preload="metadata">
          <source src="https://mgtraining.net/Welcome.mp4" type="video/mp4">
        </video>
        <div class="welcome-video-actions">
          <button class="welcome-video-skip" type="button">Skip</button>
          <button class="welcome-video-done" type="button">Don’t show again</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => {
      overlay.remove();
      markSeen();
    };

    overlay.querySelector(".welcome-video-close").addEventListener("click", close);
    overlay.querySelector(".welcome-video-skip").addEventListener("click", close);
    overlay.querySelector(".welcome-video-done").addEventListener("click", close);

    // Close when clicking outside modal
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // Try to autoplay muted (some browsers allow); user can unmute/play if blocked
    const vid = overlay.querySelector("video");
    vid.muted = true;
    vid.play().catch(() => {});
  }

  function injectStyles() {
    const css = `
#welcome-video-overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.6);
  display:flex; align-items:center; justify-content:center;
  z-index:9999; padding:16px;
}
.welcome-video-modal{
  width:min(900px, 100%); background:var(--md-default-bg-color, #fff);
  border-radius:14px; overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,.35);
}
.welcome-video-header{
  display:flex; align-items:center; justify-content:space-between;
  padding:12px 14px; border-bottom:1px solid rgba(0,0,0,.08);
}
.welcome-video-title{ font-weight:600; }
.welcome-video-close{
  border:none; background:transparent; font-size:18px; cursor:pointer;
}
.welcome-video-player{ width:100%; display:block; background:#000; }
.welcome-video-actions{
  display:flex; gap:10px; justify-content:flex-end;
  padding:12px 14px; border-top:1px solid rgba(0,0,0,.08);
}
.welcome-video-actions button{
  padding:8px 12px; border-radius:10px; cursor:pointer;
  border:1px solid rgba(0,0,0,.15);
  background:transparent;
}
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!isDocsSite()) return;
    if (alreadySeen()) return;

    injectStyles();
    buildModal();
  });
})();
