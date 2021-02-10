import { deprecate } from '@ember/debug';

const NAMESPACE = 'ember-cli-page-object';

export default function deprecateWrapper(name, message, since, until) {
  const [major, minor] = since.split('.');

  deprecate(message, false, {
    id: `${NAMESPACE}.${name}`,
    for: NAMESPACE,
    since: {
      enabled: since
    },
    until,
    url: `https://ember-cli-page-object.js.org/docs/v${major}.${minor}.x/deprecations#${name}`,
  });
}
