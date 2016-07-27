!function($) {
  // https://regex101.com/r/sA8hD2/1
  var GITHUB_URL = 'https://api.github.com/repos/san650/ember-cli-page-object/releases';

  function weight(tag_name) {
    var parsed = /^v(\d+)\.(\d+)\.(\d+)(-[a-z]+\.(\d+))?/.exec(tag_name)
    var major = parsed[1];
    var minor = parsed[2];
    var patch = parsed[3];
    var preRelease = !!parsed[4];

    return preRelease ? -1 : (major * 1000) + (minor * 100) + patch;
  }

  $.getJSON(GITHUB_URL)
    .then(function(releases) { return releases.map(function(r) { return r.tag_name }); })
    .then(function(versions) { return versions.map(function(v) { return [v, weight(v)]; }); })
    .then(function(versions) { return versions.sort(function(a, b) { return b[1] - a[1]; }); })
    .then(function(versions) { return versions.map(v => v[0]); })
    .then(function(versions) { return versions[0]; })
    .then(function(version) { console.log(version); });
}(jQuery);
