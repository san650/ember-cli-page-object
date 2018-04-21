import { assign } from '../-private/helpers';
import { getExecutionContext } from '../-private/execution_context';

import $ from '-jquery';

function fillInDynamicSegments(path, params) {
  return path.split('/').map(function(segment) {
    let match = segment.match(/^:(.+)$/);

    if (match) {
      let [, key] = match;
      let value = params[key];

      if (typeof (value) === 'undefined') {
        throw new Error(`Missing parameter for '${key}'`);
      }

      // Remove dynamic segment key from params
      delete params[key];

      return encodeURIComponent(value);
    }

    return segment;
  }).join('/');
}

function appendQueryParams(path, queryParams) {
  if (Object.keys(queryParams).length) {
    path += `?${$.param(queryParams)}`;
  }

  return path;
}

/**
 * @public
 *
 * Loads a given route.
 *
 * The resulting descriptor can be called with dynamic segments and parameters.
 *
 * @example
 *
 * import { create, visitable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   visit: visitable('/users')
 * });
 *
 * // visits '/users'
 * page.visit();
 *
 * @example
 *
 * import { create, visitable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   visit: visitable('/users/:user_id')
 * });
 *
 * // visits '/users/10'
 * page.visit({ user_id: 10 });
 *
 * @example
 *
 * import { create, visitable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   visit: visitable('/users')
 * });
 *
 * // visits '/users?name=john'
 * page.visit({ name: 'john' });
 *
 * @example
 *
 * import { create, visitable } from 'ember-cli-page-object';
 *
 * const page = create({
 *   visit: visitable('/users/:user_id')
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
      let executionContext = getExecutionContext(this);

      return executionContext.runAsync((context) => {
        let params = assign({}, dynamicSegmentsAndQueryParams);
        let fullPath = fillInDynamicSegments(path, params);

        fullPath = appendQueryParams(fullPath, params);

        return context.visit(fullPath);
      });
    }
  };
}
