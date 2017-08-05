import { assign, getContext } from '../helpers';

export function nested(pageObject, options = {}) {
  return {
    isDescriptor: true,

    get() {
      const context = getContext(this);
      const definition = assign(
        { context },
        options
      );

      return pageObject.create(definition);
    }
  };
}
