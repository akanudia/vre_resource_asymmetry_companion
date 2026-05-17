// MathJax 3 configuration for Material for MkDocs + pymdownx.arithmatex (generic mode).
//
// arithmatex wraps inline math in <span class="arithmatex">\(...\)</span> and display
// math in <div class="arithmatex">\[...\]</div>. We tell MathJax to only typeset
// inside elements with the `arithmatex` class — that prevents MathJax from running
// over the rest of the page text.
//
// The document$.subscribe block re-typesets after Material's instant-navigation
// switches pages without a full reload.

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
  }
};

document$.subscribe(() => {
  MathJax.typesetPromise();
});
