import Ember from 'ember';

var c = Ember.computed;

export default Ember.Component.extend({
  result: '',
  op: '',

  stack: c({
    get() {
      return [];
    }
  }),

  actions: {
    keyPress(key) {
      var result = this.get('result'),
          stack = this.get('stack'),
          op = this.get('op');

      switch(key) {
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

      switch(key) {
        case '-':
          this.set('op', '-');
          break;
        case '=':
          result = stack.reduce((result, value) => result + value , 0);
          this.set('result', result.toString());
          break;
      }
    }
  }
});
