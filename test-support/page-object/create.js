import Ember from 'ember';
import Ceibo from 'ceibo';
import { text } from './properties/text';
import { isVisible } from './properties/is-visible';
import { isHidden } from './properties/is-hidden';
import { clickOnText } from './properties/click-on-text';
import { clickable } from './properties/clickable';
import { contains } from './properties/contains';

const { merge } = Ember;

function plugDefaultProperties(definition) {
  if (typeof(definition.isVisible) === 'undefined') {
    definition.isVisible = isVisible();
  }

  if (typeof(definition.isHidden) === 'undefined') {
    definition.isHidden = isHidden();
  }

  if (typeof(definition.clickOn) === 'undefined') {
    definition.clickOn = clickOnText();
  }

  if (typeof(definition.click) === 'undefined') {
    definition.click = clickable();
  }

  if (typeof(definition.contains) === 'undefined') {
    definition.contains = contains();
  }

  if (typeof(definition.text) === 'undefined') {
    definition.text = text();
  }
}

function setContext(context) {
  // If there's a context, set it.
  if (context) {
    this.context = context;
  }
}

function removeContext() {
  if (this.context) {
    delete this.context;
  }
}

function buildObject(builder, target, key, definition) {
  // Don't process the test's `this` context with
  // Ceibo. Because some values in the test's `this` are
  // circular references, it gets stuck in an infinite loop.
  if (key !== 'context') {
    plugDefaultProperties(definition);

    // Call the default object builder
    Ceibo.defaults.builder.object(builder, target, key, definition);
  }
}

/**
 * Creates a new PageObject
 *
 * `definition` can include a key `context`, which is an
 * optional integration test `this` context.
 *
 * If a context is passed, it is used by actions, queries, etc.,
 * as the `this` in `this.$()`.
 *
 * If no context is passed, the global Ember acceptence test
 * helpers are used.
 *
 * @example
 *
 *   var page = PageObject.create({
 *     title: text('.title')
 *   });
 *
 *   assert.equal(page.title, 'Dummy title');
 *
 * @param {Object} definition - PageObject definition
 * @param {Object} [definition.context] - A test's `this` context
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definition, options = {}) {
  const context = typeof definition === 'object' ? definition.context : null;
  const builder = {
    object: buildObject
  };
  const page = Ceibo.create(definition, merge({ builder }, options));

  if (page) {
    page.setContext = setContext.bind(page);
    page.removeContext = removeContext.bind(page);

    page.setContext(context);
  }

  return page;
}
