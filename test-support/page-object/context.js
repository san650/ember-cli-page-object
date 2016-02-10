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

function bindMethod(obj, func) {
  return function() {
    return func.apply(obj, arguments);
  };
}

export function bindContextMethods(pageObject) {
  pageObject.setContext     = bindMethod(pageObject, setContext);
  pageObject.removeContext  = bindMethod(pageObject, removeContext);
  pageObject.render         = bindMethod(pageObject, render);
}
