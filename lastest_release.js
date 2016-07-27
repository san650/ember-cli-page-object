const GITHUB_URL = 'https://api.github.com/repos/san650/ember-cli-page-object/releases';

function weight(tag_name) {
  var parsed = /^v(\d+)\.(\d+)\.(\d+)(-[a-z]+\.(\d+))?/.exec(tag_name)
  var major = parsed[1];
  var minor = parsed[2];
  var patch = parsed[3];
  var preRelease = !!parsed[4];

  return preRelease ? -1 : (major * 1000) + (minor * 100) + patch;
}

fetch(GITHUB_URL)
  .then(request => request.json())
  .then(releases => releases.map(r => r.tag_name))
  .then(versions => versions.map(v => [v, weight(v)]))
  .then(versions => versions.sort((a, b) => b[1] - a[1]))
  .then(versions => versions.map(v => v[0]))
  .then(versions => versions[0])
  .then(version => console.log(version));


// Contributors https://api.github.com/repos/san650/ember-cli-page-object/contributors
