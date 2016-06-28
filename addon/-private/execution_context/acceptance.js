export default function AcceptanceExecutionContext(pageObjectNode) {
  this.pageObjectNode = pageObjectNode;
}

AcceptanceExecutionContext.prototype = {
  run(cb) {
    /* global wait */
    wait().then(() => {
      cb(this);
    });
  },

  click(selector, container) {
    /* global click */
    click(selector, container);
  },

  fillIn(selector, container, text) {
    /* global fillIn */
    if (container) {
      fillIn(selector, container, text);
    } else {
      fillIn(selector, text);
    }
  }
};
