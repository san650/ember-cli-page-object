// `-jquery` vendor shim supposed to isolate
// `ember-cli-page-object`'s `jquery` from the rest of application.
//
// It's important to include this shim right after our own `jquery` is included.
// This way we ensure nothing catches our own `jquery`
// and we can safely dispose it from the global `window`.
(function() {
  var jq = self['$'].noConflict();
  delete self['jQuery'];

  function vendorModule() {
    'use strict';

    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();
