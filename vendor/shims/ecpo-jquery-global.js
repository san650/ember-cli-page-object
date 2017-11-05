// Temporary store our own jquery version in a global variable for the further definition of amd module.
// We can't define amd module here cause we don't have `define()` in the very beginning of vendor.js
//
// It's important to include this shim right after our own `jquery` is included.
// This way we ensure nothing catches our own `jquery` and we can safely dispose it from the global `window`.
(function() {
  window.__ecpoJQuery__ = self['$'].noConflict();
  delete self['jQuery'];
})();
