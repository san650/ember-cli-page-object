import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';

const SUPPORTED_BEFORE_EVENTS = [
  'blur'
];

const SUPPORTED_AFTER_EVENTS = [
  'blur'
];

const validateHook = (hook, supportedEvents) => {
  const isString = typeOf(hook) === 'string';

  if (isString) {
    assert('should be of `string` type', supportedEvents.includes(hook));
  }

  return typeOf(hook) === 'function';
}

export function hookable(property, hooks = {}) {
  // Validate options
  assert('should be of `object` type', typeOf(hooks) === 'object');

  // Validate option keys
  if (hooks.before) validateHook(hooks.before, SUPPORTED_BEFORE_EVENTS);
  if (hooks.after) validateHook(hooks.after, SUPPORTED_AFTER_EVENTS);

  return function(selector, options) {
    const descriptor = property(selector, options);

    return {
      isDescriptor: true,

      get(key) {
        const fn = descriptor.get.call(this, key);

        return function() {
          // Async before and after hooks? Any use case for that?
          hooks.before();

          fn.call(this, ...arguments);

          hooks.after();

          return this;
        }
      }
    }
  }
}
