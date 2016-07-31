import Ember from 'ember';
import Ceibo from 'ceibo';

export function throwBetterError(node, key, selector) {
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

  throw new Ember.Error(msg);
}
