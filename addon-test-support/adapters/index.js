import Adapter from '../adapter';

let _adapter;

/*
 * @private
 */
export function getAdapter() {
  if (!_adapter) {
    throw new Error(`Adapter is required.

Please use \`setAdapter(\`, to instruct "ember-cli-page-object" about the adapter you want to use.`);
  }

  return _adapter;
}

export function setAdapter(adapter) {
  if (adapter === null) {
    _adapter = null;

    return;
  }

  if (false === adapter instanceof Adapter) {
    throw new Error('Invalid adapter type');
  }

  _adapter = adapter;
}
