import { $ } from '../../helpers';

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
    throw new Error(
      'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
    )
  }
}
