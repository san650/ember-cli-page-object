import $ from '-jquery';

function registerContainsExactHelper() {
  $.expr[':'].containsExact = function(a, i, m) {
    const textToFind = m[3].replace(/[-[\]{}(')*+?.[,\\^$|#\s]/g, '\\$&'); // escape special character for regex

    return $(a).text().match("^" + textToFind + "$");
  };
}

export default function() {
  registerContainsExactHelper();
}
