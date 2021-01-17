import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import action from 'ember-cli-page-object/test-support/-private/action';

export default class LoginForm extends Component {
  @tracked
  isError = false

  @tracked
  message = null

  @action
  logIn() {
    if (this.args.userName === 'user@example.com' && this.args.password === 'secret') {
      this.message = 'Valid user!';
      this.isError = false;
    } else {
      this.message = 'Invalid user!';
      this.isError = true;
    }
  }
}
