import Ember from 'ember';
import Loader from '../../../loaders';

export default function component(definition) {
  if (typeof definition === "string") {
    definition = Loader.loadComponent(definition);
  } else {
    Ember.deprecate('`component` is deprecated in favor of using plain JavaScript objects');
  }

  return {
    unfoldPageObjectDefinition: function() {
      return definition;
    }
  };
}
