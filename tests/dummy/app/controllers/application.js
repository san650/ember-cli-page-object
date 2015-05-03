import Ember from 'ember';

export default Ember.Controller.extend({
  isError: false,
  message: null,

  actions: {
    logIn: function() {
      if (this.get('userName') === 'user@example.com' && this.get('password') === 'secret') {
        this.set('message', 'Valid user!');
        this.set('isError', false);
      } else {
        this.set('message', 'Invalid user!');
        this.set('isError', true);
      }
    }
  }
});
