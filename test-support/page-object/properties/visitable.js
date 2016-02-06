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
 * Creates an action to load a route
 *
 * @example
 *
 *   var page = PageObject.create({
 *     visit: visitalbe('/users/:user_id')
 *   });
 *
 *   page.visit({ user_id: 10 });
 *
 * @param {string} path - Full path of the route to visit
 * @param {Object} dynamicSegments - Key and values to use to replace the dynamic segments
 * @param {Object} queryParams - Key and values to use as the Query Params
 * @return {Descriptor}
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
