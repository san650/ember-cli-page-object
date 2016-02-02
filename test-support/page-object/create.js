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

/**
 * Render a component's template in the context of a test.
 *
 * Throws an error if a test's context has not been set on the page.
 *
 * Returns the page object, which allows for method chaining.
 *
 * @example
 *
 * page.setContext(this)
 *   .render(hbs`{{my-component}}`)
 *   .clickOnText('Hi!');
 *
 * @param {Object} template - A compiled component template
 * @return {PageObject} - the page object
 */
function render(template) {
  if (!this.context) {
    const message = 'You must set a context on the page object before calling calling `render()`';
    const error = new Error(message);

    throw error;
  }

  this.context.render(template);

  return this;
}

/**
 * Sets the page's test context.
 *
 * Returns the page object, which allows for method chaining.
 *
 * @example
 *
 * page.setContext(this)
 *   .render(hbs`{{my-component}}`)
 *   .clickOnText('Hi!');
 *
 * @param {Object} context - A component integration test's `this` context
 * @return {PageObject} - the page object
 */
function setContext(context) {
  if (context) {
    this.context = context;
  }

  return this;
}

/**
 * Unsets the page's test context.
 *
 * Useful in a component test's `afterEach()` hook, to make sure the
 * context has been cleared after each test.
 *
 * @example
 *
 * page.removeContext();
 *
 * @return {PageObject} - the page object
 */
function removeContext() {
  if (this.context) {
    delete this.context;
  }

  return this;
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
    page.render = render.bind(page);

    page.setContext(context);
  }

  return page;
}
