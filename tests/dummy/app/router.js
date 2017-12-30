import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('calculator');
  this.route('async-calculator');
  this.route('inputs');
  this.route('html-render');
  this.route('dynamic', { path: '/users/:user_id/comments/:comment_id' });
});

export default Router;
