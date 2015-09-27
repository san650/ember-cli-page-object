import Ember from 'ember';

export default function component(definition) {
  Ember.deprecate('`component` is deprecated in favor of using plain JavaScript objects');

  return {
    unfoldPageObjectDefinition: function() {
      return definition;
    }
  };
}
