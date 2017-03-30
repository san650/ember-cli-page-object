/**
 * @public
 *
 * Allow to perform operations on intermediate results within the chain.
 *
 * Useful for grouping what's being tested.
 *
 * @example
 * andThen(() => {
 *   page.users(1).as(user => {
 *     assert.equal(user.name, 'John');
 *     assert.equal(user.lastName, 'Doe');
 *     assert.equal(user.email, 'john@doe');
 *   });
 *
 *   page.users(2).as(user => {
 *     assert.equal(user.name, 'John');
 *     assert.equal(user.lastName, 'Doe');
 *     assert.equal(user.email, 'john@doe');
 *   });
 *
 *   page.users(3).as(user => {
 *     assert.equal(user.name, 'John');
 *     assert.equal(user.lastName, 'Doe');
 *     assert.equal(user.email, 'john@doe');
 *   });
 * });
 *
 * @example
 * // Lorem <span>ipsum <strong>dolor</strong></span>
 *
 * let page = create({
 *   scope: 'span',
 *   foo: {
 *     bar: {
 *       scope: 'strong'
 *     }
 *   }
 * });
 *
 * page.foo.bar.as(element => {
 *   assert.equal(element.text, 'dolor');
 * });
 *
 * @param {function} callback - Function to be called with the current object as the parameter
 * @return {object} this
 *
 */
export function as(callback) {
  callback(this);
  return this;
}
