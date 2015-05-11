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

function clickOnText(text) {
  // Suppose that we have something like `<form><button>Submit</button></form>`
  // In this case <form> and <button> elements contains "Submit" text, so, we'll
  // want to __always__ click on the __last__ element that contains the text.
  let selector = this.qualifiedSelector(`:contains("${text}"):last`);

  this.page.lastPromise = click(selector);

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
