import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.A([
      { userName: 'jane', role: 'admin', disabledGender: false, admin: true },
      { userName: 'john', role: 'guest', disabledGender: true, admin: false }
    ]);
  }
});
