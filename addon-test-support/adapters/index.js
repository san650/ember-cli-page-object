import Adapter from "../adapter";
import RFC268Adapter from "./rfc268";

let _adapter;

/*
 * @private
 */
export function getAdapter() {
  if (!_adapter) {
    return new RFC268Adapter();
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
