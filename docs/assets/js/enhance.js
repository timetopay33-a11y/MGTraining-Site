/* Cloudflare-style enhancements:
   1) Ctrl/Cmd+K focuses the search box.
   2) Makes the "Was this page helpful?" widget work without an analytics
      provider (reveals it and shows a thank-you note on click).            */
(function () {
  // ---- 1) Ctrl/Cmd + K → focus search -------------------------------
  function focusSearch() {
    var input = document.querySelector(".md-search__input");
    if (!input) return false;
    var toggle = document.getElementById("__search");
    if (toggle) toggle.checked = true;
    input.focus();
    input.select();
    return true;
  }
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key || "").toLowerCase() === "k") {
      if (focusSearch()) e.preventDefault();
    }
  });

  // ---- 2) Feedback widget -------------------------------------------
  function initFeedback() {
    document.querySelectorAll("form.md-feedback").forEach(function (form) {
      if (form.dataset.mgInit) return;
      form.dataset.mgInit = "1";
      form.removeAttribute("hidden");
      form.addEventListener("submit", function (e) { e.preventDefault(); });

      form.querySelectorAll(".md-feedback__icon").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var val = btn.getAttribute("data-md-value");
          var list = form.querySelector(".md-feedback__list");
          if (list) list.style.display = "none";
          var note = form.querySelector(".md-feedback__note");
          if (note) {
            note.style.opacity = "1";
            note.style.transform = "none";
            note.querySelectorAll("[data-md-value]").forEach(function (n) {
              if (n.getAttribute("data-md-value") === val) {
                n.removeAttribute("hidden");
                n.style.display = "block";
              } else {
                n.setAttribute("hidden", "");
              }
            });
          }
        });
      });
    });
  }

  function run() { initFeedback(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  // Re-run on Material instant navigation
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () { run(); });
  }
})();
