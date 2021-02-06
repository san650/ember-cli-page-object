import { later } from '@ember/runloop';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class Calculator extends Controller {
  @tracked
  result = '';

  @tracked
  op = '';

  @tracked
  loading = false;

  @tracked
  stack = A([]);

  @tracked
  expression = '';

  @action
  onKeyPress(key, asyncOp) {
    let exec = () => {
      let result = this.expression;
      let stack = this.stack;
      let op = this.op;

      switch (key) {
        case '+':
        case '-':
        case '=':
          stack.push(parseInt(op + result));
          this.result = result;
          this.expression = '';
          break;
        default:
          this.expression = result + key.toString();
          break;
      }

      switch (key) {
        case '-':
          this.op = '-';
          break;
        case '=':
          result = stack.reduce((result, value) => result + value , 0);
          this.expression = result.toString();
          break;
      }
    }

    if (asyncOp) {
      this.loading = true;
      later(() => {
        this.loading = false;
        exec();
      }, 50);
    } else {
      exec();
    }
  }
}
