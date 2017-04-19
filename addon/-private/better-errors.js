import Ember from 'ember';
import Ceibo from 'ceibo';

export const ELEMENT_NOT_FOUND = 'Element not found.';

export function throwBetterError(node, key, selector, msg) {
  let path = [key];
  let current;

  for (current = node; current; current = Ceibo.parent(current)) {
    path.unshift(Ceibo.meta(current).key);
  }

  path[0] = 'page';

  let fullErrorMessage = `${msg}

PageObject: '${path.join('.')}'
  Selector: '${selector}'
`;

  throw new Ember.Error(fullErrorMessage);
}
