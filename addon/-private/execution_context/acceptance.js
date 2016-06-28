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
  }
};
