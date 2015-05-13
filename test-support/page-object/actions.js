/* global visit, fillIn, click */

import Attribute from './attribute';

function visitable() {
  this.page.lastPromise = visit(this.path);

  return this.page;
}

function clickable() {
  this.page.lastPromise = click(this.qualifiedSelector());

  return this.page;
}

function fillable(text) {
  this.page.lastPromise = fillIn(this.qualifiedSelector(), text);

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
