/* global visit */

import Ember from 'ember';
import Descriptor from '../descriptor';

function fillInDynamicSegments(path, params) {
  return path.split('/').map(function(segment) {
    let match;

    if (match = segment.match(/^:(.+)$/)) {
      let key = match[1];

      if (!params[key]) {
        throw new Error(`Missing parameter for '${key}'`);
      }

      return params[key];
    }

    return segment;
  }).join('/');
}

/**
 * Loads a path
 *
 * @param {Object} target - Component that owns the property
 * @param {string} key - Name of the key associated to this property
 * @param {Object} options - Additional options
 * @param {Object} params - Key and values to use to replace the dynamic segments
 * @param {Object} queryParams - Key and values to use as the Query Params
 * @return {Object} target component (this allows chaining)
 */
function doVisit(target, key, options, params = {}, queryParams = {}) {
  let path = options.path;

  if (path.indexOf(':') !== -1) {
    path = fillInDynamicSegments(path, params);
  }

  if (Object.keys(queryParams).length > 0) {
    path += "?" + Ember.$.param(queryParams);
  }

  visit(path);

  return target;
}

/**
 * Creates an action to load a path
 *
 * @example
 *
 *   var page = PO.build({
 *     visit: visitalbe('/users')
 *   });
 *
 *   page.visit();
 *
 * @param {string} path - Full path of the route to visit
 * @return {Descriptor}
 */
export default function visitable(path, options = {}) {
  options.path = path;

  return new Descriptor(doVisit, options);
}
