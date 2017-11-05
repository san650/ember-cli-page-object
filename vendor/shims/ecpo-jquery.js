// Define an amd '-jquery' shim which is used by ember-cli-page-object internally
(function() {
  var jquery = window.__ecpoJQuery__;
  delete window.__ecpoJQuery__;

  function vendorModule() {
    'use strict';

    return { 'default': jquery };
  }

  define('-jquery', [], vendorModule);
})();
