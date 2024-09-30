import Component from '@ember/component';
import { action } from '@ember/object';
import { computed as c } from '@ember/object';

export default Component.extend({
  result: '',
  op: '',

  stack: c({
    get() {
      return [];
    },
  }),

  keyPress: action(function (key) {
    let result = this.result;
    let stack = this.stack;
    let op = this.op;

    switch (key) {
      case '+':
      case '-':
      case '=':
        stack.push(parseInt(op + result));
        this.set('result', '');
        break;
      default:
        this.set('result', result + key.toString());
        break;
    }

    switch (key) {
      case '-':
        this.set('op', '-');
        break;
      case '=':
        result = stack.reduce((result, value) => result + value, 0);
        this.set('result', result.toString());
        break;
    }
  }),
});
