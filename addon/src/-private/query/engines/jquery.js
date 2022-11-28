import { $ } from '../../helpers';
import deprecate from '../../deprecate';

export default class JQueryQueryEngine {
  static all(path, containerElement) {
    const selector = path.join(' ');

    validate(selector);
    return $(selector, containerElement).toArray();
  }

  static serialize(path) {
    return path.join(' ');
  }
}

function validate(selector) {
  if (selector.indexOf(',') > -1) {
    deprecate(
      'comma-separated-selectors',
      'Usage of comma separated selectors is deprecated in ember-cli-page-object',
      '1.16.0',
      '2.0.0'
    );
  }
}
