/* global visit, fillIn, click */
import Ember from 'ember';
import Attribute from './attribute';

function keys(object) {
  if (!Object.keys && Ember.keys) {
    return Ember.keys(object);
  } else {
    return Object.keys(object);
  }
}

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

  if (keys(queryParams).length > 0) {
    path += "?" + Ember.$.param(queryParams);
  }

  visit(path);

  return this.page;
}

function clickable() {
  click(this.qualifiedSelector());

  return this.page;
}

function fillable(text) {
  fillIn(this.qualifiedSelector(), text);

  return this.page;
}

function clickOnText(text) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  let selector = this.qualifiedSelector(`:contains("${text}"):last`);

  click(selector);

  return this.page;
}

export function visitableAttribute(path) {
  return new Attribute(visitable, null, null, { path });
}

export function clickableAttribute(selector, options = {}) {
  return new Attribute(clickable, selector, options);
}

export function fillableAttribute(selector, options = {}) {
  return new Attribute(fillable, selector, options);
}

export function clickOnTextAttribute(selector, options = {}) {
  return new Attribute(clickOnText, selector, options);
}
