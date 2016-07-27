const GITHUB_URL = 'https://api.github.com/repos/san650/ember-cli-page-object/releases';

function weight(tag_name) {
  var parsed = /v(\d+)\.(\d+)\.(\d+)/.exec(tag_name)
  var major = parsed[1];
  var minor = parsed[2];
  var patch = parsed[3];

  return major * 1000 + major * 100 + minor;
}

fetch(GITHUB_URL)
  .then(request => request.json())
  .then(releases => releases.map(release => release.tag_name))
  .then(versions => versions.map(version => [version, weight(version)]))
  .then(versions => versions.sort((a, b) => b[1] - a[1]))
  .then(versions => versions.map(version => version[0]))
  .then(releases => console.log(releases));
