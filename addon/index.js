import { create }      from './create';                   export { create };
import { collection }  from './collection';               export { collection };
import { clickable }   from './-private/properties/clickable';        export { clickable };
import { clickOnText } from './-private/properties/click-on-text';    export { clickOnText };
import { fillable }    from './-private/properties/fillable';         export { fillable }; export const selectable = fillable;
import { visitable }   from './actions/visitable';        export { visitable };
import { triggerable } from './actions/triggerable';      export { triggerable };
import { contains }    from './predicates/contains';      export { contains };
import { hasClass }    from './predicates/has-class';     export { hasClass };
import { isHidden }    from './predicates/is-hidden';     export { isHidden };
import { isVisible }   from './predicates/is-visible';    export { isVisible };
import { notHasClass } from './predicates/not-has-class'; export { notHasClass };
import { attribute }   from './queries/attribute';        export { attribute };
import { count }       from './queries/count';            export { count };
import { is }          from './queries/is';               export { is };
import { property }    from './queries/property';         export { property };
import { text }        from './queries/text';             export { text };
import { value }       from './queries/value';            export { value };

export { buildSelector, findElementWithAssert, findElement, getContext } from './helpers';

export default {
  attribute,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  hasClass,
  is,
  isHidden,
  isVisible,
  notHasClass,
  property,
  selectable,
  text,
  value,
  visitable,
  triggerable
};
