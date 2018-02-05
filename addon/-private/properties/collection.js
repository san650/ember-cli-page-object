import { deprecate } from '@ember/application/deprecations';
import { warn } from '@ember/debug';

import { collection as mainCollection } from './collection/main';
import { collection as legacyCollection } from './collection/legacy';

/**
 * @public
 *
 * Creates a enumerable that represents a collection of items. The collection is zero-indexed
 * and has the following public methods and properties:
 *
 * IMPORTANT: You can use Array accessors only on browsers that support Proxy.
 *            See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Browser_compatibility
 *
 * - `length` - The number of items in the collection.
 * - `objectAt()` - Returns the page for the item at the specified index.
 * - `filter()` - Filters the items in the array and returns the ones which match the predicate function.
 * - `filterBy()` - Filters the items of the array by the specified property, returning all that are truthy or that match an optional value.
 * - `forEach()` - Runs a function for each item in the collection
 * - `map()` - maps over the elements of the collection
 * - `mapBy()` - maps over the elements of the collecton by the specified property
 * - `toArray()` - returns an array containing all the items in the collection
 * - `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array
 *
 * @example
 *
 * // <table>
 * //   <caption>List of users</caption>
 * //   <tbody>
 * //     <tr>
 * //       <td>Mary<td>
 * //       <td>Watson</td>
 * //     </tr>
 * //     <tr>
 * //       <td>John<td>
 * //       <td>Doe</td>
 * //     </tr>
 * //   </tbody>
 * // </table>
 *
 * const page = PageObject.create({
 *   users: collection('table tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 })
 *   })
 * });
 *
 * assert.equal(page.users.length, 2);
 * assert.equal(page.users.objectAt(1).firstName, 'John');
 * assert.equal(page.users.objectAt(1).lastName, 'Doe');
 *
 * @example
 *
 * // <div class="admins">
 * //   <table>
 * //     <tbody>
 * //       <tr>
 * //         <td>Mary<td>
 * //         <td>Watson</td>
 * //       </tr>
 * //       <tr>
 * //         <td>John<td>
 * //         <td>Doe</td>
 * //       </tr>
 * //     </tbody>
 * //   </table>
 * // </div>
 *
 * // <div class="normal">
 * //   <table>
 * //   </table>
 * // </div>
 *
 * const page = PageObject.create({
 *   scope: '.admins',
 *
 *   users: collection('table tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 })
 *   })
 * });
 *
 * assert.equal(page.users.length, 2);
 *
 * @example
 *
 * // <table>
 * //   <caption>User Index</caption>
 * //   <tbody>
 * //     <tr>
 * //         <td>Mary<td>
 * //         <td>Watson</td>
 * //       </tr>
 * //       <tr>
 * //         <td>John<td>
 * //         <td>Doe</td>
 * //       </tr>
 * //   </tbody>
 * // </table>
 *
 * const page = PageObject.create({
 *   scope: 'table',
 *
 *   users: PageObject.collection('tr', {
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 }),
 *   })
 * });
 *
 * let john = page.users.filter((item) => item.firstName === 'John' )[0];
 * assert.equal(john.lastName, 'Doe');
 *
 * @example if the browser you run tests supports Proxy, you can use array accessors to access elements by index
 *
 * // <table>
 * //   <tr>
 * //       <td>Mary<td>
 * //   </tr>
 * //   <tr>
 * //     <td>John<td>
 * //   </tr>
 * // </table>
 *
 * const page = PageObject.create({
 *   users: PageObject.collection('tr')
 * });
 *
 * // This only works on browsers that support `Proxy`
 * assert.equal(page.users[0].text, 'Mary');
 * assert.equal(page.users[1].text, 'John');
 *
 *
 * @param {String} scopeOrDefinition - Selector to define the items of the collection
 * @param {Object} [definitionOrNothing] - Object with the definition of item properties
 * @return {Descriptor}
 */
export function collection(scopeOrDefinition, definitionOrNothing) {

  if (typeof scopeOrDefinition === 'string') {
    return mainCollection(scopeOrDefinition, definitionOrNothing);
  }

  deprecate('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.', false, {
    id: 'ember-cli-page-object.old-collection-api',
    until: '2.0.0',
    url: 'https://gist.github.com/san650/17174e4b7b1fd80b049a47eb456a7cdc#file-old-collection-api-js',
  });

  warn(
    'Legacy page object collection definition is invalid. Please, make sure you include a `itemScope` selector.',
    scopeOrDefinition.itemScope,
    {
      id: 'ember-cli-page-object.legacy-collection-missing-item-scope'
    }
  );

  return legacyCollection(scopeOrDefinition);
}
