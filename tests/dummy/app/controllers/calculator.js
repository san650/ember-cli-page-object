import Ember from 'ember';

let c = Ember.computed;

export default Ember.Controller.extend({
  init() {
    this.setProperties({
      result: '',
      expression: '',
      op: ''
    });
  },

  stack: c({
    get() {
      return [];
    }
  }),

  actions: {
    keyPress(key) {
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
  }
});
