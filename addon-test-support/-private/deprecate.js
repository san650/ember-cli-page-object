import { deprecate as emberDeprecate } from '@ember/application/deprecations';

const NAMESPACE = 'ember-cli-page-object';

export default function deprecate(name, message, since, until) {
  const [major, minor] = since.split('.');

  emberDeprecate(message, false, {
    id: `${NAMESPACE}.${name}`,
    for: NAMESPACE,
    since: {
      enabled: since
    },
    until,
    url: `https://ember-cli-page-object.js.org/docs/v${major}.${minor}.x/deprecations#${name}`,
  });
}
