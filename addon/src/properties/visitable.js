import action from '../-private/action';
import { getAdapter } from '../adapters/index';

function fillInDynamicSegments(path, params) {
  return path
    .split('/')
    .map(function (segment) {
      let match = segment.match(/^:(.+)$/);

      if (match) {
        let [, key] = match;
        let value = params[key];

        if (typeof value === 'undefined') {
          throw new Error(`Missing parameter for '${key}'`);
        }

        // Remove dynamic segment key from params
        delete params[key];

        return encodeURIComponent(value);
      }

      return segment;
    })
    .join('/');
}

function addValue(
  urlSearchParams,
  key,
  value,
  parentKey = '',
  isArrayValue = false
) {
  let keyWithParent = parentKey ? `${parentKey}[${key}]` : key;

  if (Array.isArray(value)) {
    // array
    value.forEach((arrayItem) =>
      addValue(urlSearchParams, key, arrayItem, parentKey, true)
    );
  } else if (typeof value === 'object' && value !== null) {
    // object
    Object.keys(value).forEach((_key) =>
      addValue(urlSearchParams, _key, value[_key], keyWithParent)
    );
  } else {
    // primitive
    if (isArrayValue) {
      urlSearchParams.append(`${keyWithParent}[]`, value);
    } else {
      urlSearchParams.append(keyWithParent, value);
    }
  }

  return urlSearchParams;
}

function appendQueryParams(path, queryParams) {
  let keys = Object.keys(queryParams);

  if (keys.length) {
    let urlSearchParams = keys.reduce(
      (urlSearchParams, key) =>
        addValue(urlSearchParams, key, queryParams[key]),
      new URLSearchParams()
    );

    path += `?${urlSearchParams}`;
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
 * await page.visit();
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
 * await page.visit({ user_id: 10 });
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
 * await page.visit({ name: 'john' });
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
 * await page.visit({ user_id: 1, name: 'john' });
 *
 * @param {string} path - Full path of the route to visit
 * @return {Descriptor}
 *
 * @throws Will throw an error if dynamic segments are not filled.
 *         Note: An error instance may contain a `cause.error` property
 *         with the original error thrown by an underlying test helper.
 */
export function visitable(path) {
  return action(function (dynamicSegmentsAndQueryParams = {}) {
    let params = { ...dynamicSegmentsAndQueryParams };
    let fullPath = fillInDynamicSegments(path, params);

    fullPath = appendQueryParams(fullPath, params);

    return getAdapter()
      .visit(fullPath)
      .catch((e) => {
        throw new Error(`Failed to visit URL '${fullPath}': ${e.toString()}`, {
          cause: e,
        });
      });
  });
}
