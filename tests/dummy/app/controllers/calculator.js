import { later } from '@ember/runloop';
import Controller from '@ember/controller';
import { computed as c } from '@ember/object';

export default Controller.extend({
  init() {
    this.setProperties({
      result: '',
      expression: '',
      op: '',
      loading: false
    });
  },

  stack: c({
    get() {
      return [];
    }
  }),

  actions: {
    keyPress(key, asyncOp) {
      let exec = () => {
        let result = this.get('expression');
        let stack = this.get('stack');
        let op = this.get('op');

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
            result = stack.reduce((result, value) => result + value , 0);
            this.set('expression', result.toString());
            break;
        }
      }

      if (asyncOp) {
        this.set('loading', true);
        later(() => {
          this.set('loading', false);
          exec();
        }, 50);
      } else {
        exec();
      }
    }
  }
});
