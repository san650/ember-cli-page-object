import { deprecate } from '@ember/application/deprecations';

import { collection as mainCollection } from './collection/main';
import { collection as legacyCollection } from './collection/legacy';

/**
 * @public
 *
 * Creates a enumerable that represents a collection of items. The collection is zero-indexed
 * and has the following public methods and properties:
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
 *   users: collection({
 *     scope: 'table tr',
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
 *   users: collection({
 *     scope: 'table tr',
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
 *   users: PageObject.collection({
 *     scope: 'tr',
 *     firstName: text('td', { at: 0 }),
 *     lastName: text('td', { at: 1 }),
 *   })
 * });
 *
 * let john = page.users.filter((item) => item.firstName === 'John' )[0];
 * assert.equal(john.lastName, 'Doe');
 *
 * @param {Object} definition - Collection definition
 * @return {Descriptor}
 */
export function collection(definition) {
  if (useLegacyAPI(definition)) {
    deprecate('You are currently using the legacy collection API, check the documentation to see how to upgrade to the new API.', false, {
      id: 'ember-cli-page-object.old-collection-api',
      until: '2.0.0',
      url: 'https://gist.github.com/san650/17174e4b7b1fd80b049a47eb456a7cdc#file-old-collection-api-js',
    });

    return legacyCollection(definition);
  } else {
    return mainCollection(definition);
  }
}

function useLegacyAPI(definition) {
  // We test the use of `itemScope` attribute to guess that the users are using
  // the legacy API.
  //
  // Also, there's a common mistake in page objects created in the wild that
  // don't define the `itemScope` attribute but they do implement the `items`
  // object.
  //
  //     var page = create({
  //       foo: collection({
  //         scope: '.foo',
  //         item: {
  //           text: text('p')
  //         }
  //       })
  //     });
  //
  // Although this doesn't make any sense and doesn't work in legacy
  // collections definitions, using the new collection API in this cases break
  // tests suites. For that reason we use the legacy definition and print a
  // deprecation warning.
  return ('itemScope' in definition) ||
    ('scope' in definition && 'item' in definition);
}
