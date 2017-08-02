import { assign } from '../helpers';

export function nested(pageObject, options = {}) {
  return {
    isDescriptor: true,

    get() {
      const definition = assign(
        { context: this.context },
        options
      );

      return pageObject.create(definition);
    }
  };
}
