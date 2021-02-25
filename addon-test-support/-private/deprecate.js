// import { deprecate } from '@ember/application/deprecations';

const NAMESPACE = 'ember-cli-page-object';

// @todo: remove `_` after getting rid of the ember deprecate
// for some reason renaming of the import leads to runrime issues
export default function _deprecate(name, message, since, until) {
  console.warn(NAMESPACE, name, message, since, until);
  // const [major, minor] = since.split('.');

  // deprecate(message, false, {
  //   id: `${NAMESPACE}.${name}`,
  //   for: NAMESPACE,
  //   since: {
  //     enabled: since
  //   },
  //   until,
  //   url: `https://ember-cli-page-object.js.org/docs/v${major}.${minor}.x/deprecations#${name}`,
  // });
}
