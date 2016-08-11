/* globals QUnit */

import Ember from 'ember';
import Ceibo from 'ceibo';

export function throwBetterError(node, key, selector, stopOnError = false) {
  let path = [key];
  let current;

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  let msg = `Element not found.

PageObject: '${path.join('.')}'
  Selector: '${selector}'
`;

  let error = new Ember.Error(msg);

  if (stopOnError) {
    console.error(error);
    QUnit.stop();
    alert('Test have been stopped');
  } else {
    throw error;
  }

}
