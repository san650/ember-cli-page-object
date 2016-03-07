import Ember from 'ember';

var { merge, $ } = Ember;

function fillInDynamicSegments(path, params) {
  return path.split('/').map(function(segment) {
    let match = segment.match(/^:(.+)$/);

    if (match) {
      let key = match[1],
          value = params[key];

      if (typeof value === 'undefined') {
        throw new Error(`Missing parameter for '${key}'`);
      }

      // Remove dynamic segment key from params
      delete params[key];

      return value;
    }

    return segment;
  }).join('/');
}

function appendQueryParams(path, queryParams) {
  if (Object.keys(queryParams).length) {
    path += "?" + $.param(queryParams);
  }

  return path;
}

/**
 * Loads a given route.
 *
 * The resulting descriptor can be called with dynamic segments and parameters.
 *
 * @example
 *
 * const page = PageObject.create({
 *   visit: PageObject.visitable('/users')
 * });
 *
 * // visits '/users'
 * page.visit();
 *
 * @example
 *
 * const page = PageObject.create({
 *   visit: PageObject.visitable('/users/:user_id')
 * });
 *
 * // visits '/users/10'
 * page.visit({ user_id: 10 });
 *
 * @example
 *
 * const page = PageObject.create({
 *   visit: PageObject.visitable('/users')
 * });
 *
 * // visits '/users?name=john'
 * page.visit({ name: 'john' });
 *
 * @example
 *
 * const page = PageObject.create({
 *   visit: PageObject.visitable('/users/:user_id')
 * });
 *
 * // visits '/users/1?name=john'
 * page.visit({ user_id: 1, name: 'john' });
 *
 * @param {string} path - Full path of the route to visit
 * @return {Descriptor}
 *
 * @throws Will throw an error if dynamic segments are not filled
 */
export function visitable(path) {
  return {
    isDescriptor: true,

    value(dynamicSegmentsAndQueryParams = {}) {
      var params = merge({}, dynamicSegmentsAndQueryParams);
      var fullPath = fillInDynamicSegments(path, params);

      fullPath = appendQueryParams(fullPath, params);

      /* global visit */
      visit(fullPath);

      return this;
    }
  };
}
