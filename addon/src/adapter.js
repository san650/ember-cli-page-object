export default class Adapter {
  get testContainer() {
    throw new Error('`testContainer` is not implemented for the adapter');
  }
  visit(/* path */) {
    throw new Error('`visit` is not implemented for the adapter');
  }
  click(/* element */) {
    throw new Error('`click` is not implemented for the adapter');
  }
  fillIn(/*element, content*/) {
    throw new Error('`fillIn` is not implemented for the adapter');
  }
  triggerEvent(/*element, eventName, eventOptions*/) {
    throw new Error('`triggerEvent` is not implemented for the adapter');
  }
  focus(/* element */) {
    throw new Error('`focus` is not implemented for the adapter');
  }
  blur(/* element */) {
    throw new Error('`blur` is not implemented for the adapter');
  }
}
