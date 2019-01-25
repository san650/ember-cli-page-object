import { findElementWithAssert } from 'ember-cli-page-object/extend';
import { getExecutionContext } from './execution_context';
import { throwBetterError } from './better-errors';

export function run(node, scope, query, action) {
  return getExecutionContext(node).runAsync((adapter) => {
    const element = findElementWithAssert(node, scope, query).get(0);

    return adapter.run(
      () => action(element, adapter),
      (e) => throwBetterError(node, query.pageObjectKey, e, {
        selector: scope
      })
    );
  });
}
