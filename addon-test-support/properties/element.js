export function element(selector) {
  return {
    isDescriptor: true,

    get() {
      return document.querySelectorAll(selector);
    }
  }
}
