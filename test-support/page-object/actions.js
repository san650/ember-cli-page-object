/* global visit */
import Ember from 'ember';
import Attribute from './attribute';

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

function visitable(params = {}, queryParams = {}) {
  let path = this.path;

  if (path.indexOf(':') !== -1) {
    path = fillInDynamicSegments(path, params);
  }

  if (Ember.keys(queryParams).length > 0) {
    path += "?" + Ember.$.param(queryParams);
  }

  visit(path);

  return this.page;
}

export function visitableAttribute(path) {
  return new Attribute(visitable, null, null, { path });
}
