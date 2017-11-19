// Map `jquery` from the app to an amd module called `-jquery` for internal usage
(function() {
  function vendorModule() {
    'use strict';

    var jq = self.jQuery;
    if (!jq) {
      throw new Error('Unable to find jQuery');
    }

    return { 'default': jq };
  }

  define('-jquery', [], vendorModule);
})();
