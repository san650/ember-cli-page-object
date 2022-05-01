import Ceibo from '@ro0gr/ceibo';

export function isPageObject(property) {
  if (property && typeof property === 'object') {
    let meta = Ceibo.meta(property);

    return Boolean(meta && meta.__poDef__);
  } else {
    return false;
  }
}

export function getPageObjectDefinition(node) {
  if (!isPageObject(node)) {
    throw new Error(
      'cannot get the page object definition from a node that is not a page object'
    );
  } else {
    return Ceibo.meta(node).__poDef__;
  }
}

export function storePageObjectDefinition(node, definition) {
  Ceibo.meta(node).__poDef__ = definition;
}
