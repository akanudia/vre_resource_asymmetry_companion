// MathJax 3 configuration for Material for MkDocs + pymdownx.arithmatex (generic mode).
//
// arithmatex wraps inline math in <span class="arithmatex">\(...\)</span> and display
// math in <div class="arithmatex">\[...\]</div>. We tell MathJax to only typeset
// inside elements with the `arithmatex` class — that prevents MathJax from running
// over the rest of the page text.
//
// IMPORTANT — race condition fix (2026-05-20):
// The previous version had `document$.subscribe(() => MathJax.typesetPromise())`
// at the top level of this file. That fired immediately because document$ is
// a BehaviorSubject that replays its current value to new subscribers — but at
// that moment the MathJax library (tex-mml-chtml.js from the CDN) hadn't
// finished loading yet, so `MathJax.typesetPromise` was undefined and the
// handler threw TypeError. The throw left the page in a broken state where
// neither the initial MathJax pageReady nor any subsequent instant-navigation
// typeset took effect.
//
// The fix is to register the document$ subscription from inside MathJax's
// own startup.pageReady hook — that hook runs only after the library is
// fully loaded, so MathJax.typesetPromise is guaranteed to exist when the
// subscription fires. The clearCache + typesetClear + texReset chain before
// typesetPromise() is Material for MkDocs' recommended pattern for clean
// re-typesetting on instant-navigation page swaps.

window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  },
  startup: {
    pageReady: () => {
      // Default pageReady typesets the initial page contents.
      return MathJax.startup.defaultPageReady().then(() => {
        // After the library is fully ready, hook into Material's
        // instant-navigation observable to re-typeset on every page swap.
        if (typeof document$ !== "undefined") {
          document$.subscribe(() => {
            MathJax.startup.output.clearCache();
            MathJax.typesetClear();
            MathJax.texReset();
            MathJax.typesetPromise();
          });
        }
      });
    }
  }
};
