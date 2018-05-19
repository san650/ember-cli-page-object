import { getExecutionContext } from '../-private/execution_context';

/**
 * Convenience helper for creating async page object actions
 *
 * @param {Function} work
 * @return {CeiboDescriptor}
 */
export function action(work) {
  return {
    isDescriptor: true,

    get(key) {
      // all the incomning arguments propagated to an action, e.g. `fillIn('value')`
      return function() {
        const options = {
          pageObjectKey: `${key}()`,
        };

        return getExecutionContext(this).runAsync(() => {
          return work(this, options, ...arguments);
        });
      };
    }
  };
}
