const NAMESPACE = 'ember-cli-page-object';

export default function deprecateWrapper(name, message, since, until) {
  if (Array.isArray(deprecate.__calls)) {
    deprecate.__calls.push([name, message, since, until]);
  }

  const [major, minor] = since.split('.');

  console.warn(`DEPRECATION: ${message} [deprecation id: ${NAMESPACE}.${name}] See https://ember-cli-page-object.js.org/docs/v${major}.${minor}.x/deprecations#${name} for more details.`)
}
