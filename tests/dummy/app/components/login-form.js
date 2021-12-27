import Component from '@ember/component';

export default Component.extend({
  isError: false,

  message: null,

  actions: {
    logIn() {
      if (this.userName === 'user@example.com' && this.password === 'secret') {
        this.set('message', 'Valid user!');
        this.set('isError', false);
      } else {
        this.set('message', 'Invalid user!');
        this.set('isError', true);
      }
    },
  },
});
