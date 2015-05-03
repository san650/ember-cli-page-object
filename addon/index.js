import { hasClass, notHasClass, isVisible, isHidden } from './predicates';
import { attribute, count, text, value } from './queries';
import { clickable, fillable, visitable } from './actions';

function Page() {
}

function build(definition) {
  let page = new Page(),
      keys = Object.keys(definition);

  keys.forEach(function(key) {
    let attr = definition[key];

    page[key] = (attr.build) ? attr.build(key, page) : attr;
  });

  return page;
}

export default {
  attribute,
  build,
  clickable,
  count,
  fillable,
  hasClass,
  isHidden,
  isVisible,
  notHasClass,
  text,
  value,
  visitable
};
