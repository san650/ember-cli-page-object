import Ceibo from 'ceibo';
import { render, setContext, removeContext } from './context';
import { assign } from './helpers';
import { visitable } from './properties/visitable';
import dsl from './dsl';

// See https://github.com/san650/ceibo#examples for more info on how Ceibo
// builders work.
function buildObject(node, blueprintKey, blueprint, defaultBuilder) {
  blueprint = assign(assign({}, dsl), blueprint);

  return defaultBuilder(node, blueprintKey, blueprint, defaultBuilder);
}

/**
 * Creates a new PageObject.
 *
 * By default, the resulting PageObject will respond to:
 *
 * - **Actions**: click, clickOn, fillIn, select
 * - **Predicates**: contains, isHidden, isPresent, isVisible
 * - **Queries**: text
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
 * // <div class="title">My title</div>
 *
 * import PageObject, { text } from 'ember-cli-page-object';
 *
 * const page = PageObject.create({
 *   title: text('.title')
 * });
 *
 * assert.equal(page.title, 'My title');
 *
 * @example
 *
 * // <div id="my-page">
 * //   My super text
 * //   <button>Press Me</button>
 * // </div>
 *
 * const page = PageObject.create({
 *   scope: '#my-page'
 * });
 *
 * assert.equal(page.text, 'My super text');
 * assert.ok(page.contains('super'));
 * assert.ok(page.isPresent);
 * assert.ok(page.isVisible);
 * assert.notOk(page.isHidden);
 * assert.equal(page.value, 'my input value');
 *
 * // clicks div#my-page
 * page.click();
 *
 * // clicks button
 * page.clickOn('Press Me');
 *
 * // fills an input
 * page.fillIn('name', 'John Doe');
 *
 * // selects an option
 * page.select('country', 'Uruguay');
 *
 * @example Defining path
 *
 * const usersPage = PageObject.create('/users');
 *
 * // visits user page
 * usersPage.visit();
 *
 * const userTasksPage = PageObject.create('/users/tasks', {
 *  tasks: collection({
 *    itemScope: '.tasks li',
 *    item: {}
 *  });
 * });
 *
 * // get user's tasks
 * userTasksPage.visit();
 * userTasksPage.tasks().count
 *
 * @public
 *
 * @param {Object} definition - PageObject definition
 * @param {Object} [definition.context] - A test's `this` context
 * @param {Object} options - [private] Ceibo options. Do not use!
 * @return {PageObject}
 */
export function create(definitionOrUrl, definitionOrOptions, optionsOrNothing) {
  let definition;
  let url;
  let options;

  if (typeof (definitionOrUrl) === 'string') {
    url = definitionOrUrl;
    definition = definitionOrOptions || {};
    options = optionsOrNothing || {};
  } else {
    url = false;
    definition = definitionOrUrl;
    options = definitionOrOptions || {};
  }

  definition = assign({}, definition);

  if (url) {
    definition.visit = visitable(url);
  }

  let { context } = definition;
  delete definition.context;

  let builder = {
    object: buildObject
  };

  let page = Ceibo.create(definition, assign({ builder }, options));

  if (page) {
    page.render = render;
    page.setContext = setContext;
    page.removeContext = removeContext;

    page.setContext(context);
  }

  return page;
}
