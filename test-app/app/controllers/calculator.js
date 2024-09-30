import { later } from '@ember/runloop';
import Controller from '@ember/controller';
import { computed as c } from '@ember/object';
import { action } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);

    this.setProperties({
      result: '',
      expression: '',
      op: '',
      loading: false,
    });
  },

  stack: c({
    get() {
      return [];
    },
  }),

  keyPress: action(function (key, asyncOp) {
    let exec = () => {
      let result = this.expression;
      let stack = this.stack;
      let op = this.op;

      switch (key) {
        case '+':
        case '-':
        case '=':
          stack.push(parseInt(op + result));
          this.set('result', result);
          this.set('expression', '');
          break;
        default:
          this.set('expression', result + key.toString());
          break;
      }

      switch (key) {
        case '-':
          this.set('op', '-');
          break;
        case '=':
          result = stack.reduce((result, value) => result + value, 0);
          this.set('expression', result.toString());
          break;
      }
    };

    if (asyncOp) {
      this.set('loading', true);
      later(() => {
        this.set('loading', false);
        exec();
      }, 50);
    } else {
      exec();
    }
  }),
});
