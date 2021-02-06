import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { later } from '@ember/runloop';

export default class CalculatinDevice extends Component {
  @tracked
  result = '';

  @tracked
  op = '';

  @tracked
  stack = A([]);

  @tracked
  loading = false;

  @action
  onKeyPress(key, event, asyncOp) {
    let exec = () => {
      let { result, stack, op } = this;

      switch (key) {
        case '+':
        case '-':
        case '=':
          stack.push(parseInt(op + result));
          this.result = '';
          break;
        default:
          this.result = result + key.toString();
          break;
      }

      switch (key) {
        case '-':
          this.op = '-';
          break;
        case '=':
          result = stack.reduce((result, value) => result + value , 0);
          this.result = result.toString();
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
