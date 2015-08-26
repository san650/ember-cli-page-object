import ENV from '../config/environment';
import Loader from 'ember-cli-page-object/loaders';

export default {
  name: 'ember-cli-page-object',

  initialize: function(container, application) {
    Loader.set('prefix', ENV.modulePrefix);
  }
};
