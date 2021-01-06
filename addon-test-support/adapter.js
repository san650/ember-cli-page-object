export default class Adapter {
  get testContainer() {
    throw new Error('`testContainer` is not implemented for the adater');
  }
  visit( /* path */) {
    throw new Error('`visit` is not implemented for the adater');
  }
  click( /* element */) {
    throw new Error('`click` is not implemented for the adater');
  }
  fillIn( /*element, content*/) {
    throw new Error('`fillIn` is not implemented for the adater');
  }
  triggerEvent( /*element, eventName, eventOptions*/) {
    throw new Error('`triggerEvent` is not implemented for the adater');
  }
  focus( /* element */) {
    throw new Error('`focus` is not implemented for the adater');
  }
  blur( /* element */) {
    throw new Error('`blur` is not implemented for the adater');
  }
}
