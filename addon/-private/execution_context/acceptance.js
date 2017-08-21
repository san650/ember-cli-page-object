import ExecutionContext from './context';

export default function AcceptanceExecutionContext(pageObjectNode) {
  ExecutionContext.call(this, pageObjectNode);
}

AcceptanceExecutionContext.prototype = Object.create(ExecutionContext.prototype);

AcceptanceExecutionContext.prototype.runAsync = function(cb) {
  window.wait().then(() => {
    cb(this);
  });

  return this.pageObjectNode;
};
