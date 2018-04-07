import { create }      from './-private/create';                   export { create };

import { attribute }   from './-private/properties/attribute';     export { attribute };
import { blurrable }   from './-private/properties/blurrable';     export { blurrable };
import { clickOnText } from './-private/properties/click-on-text'; export { clickOnText };
import { clickable }   from './-private/properties/clickable';     export { clickable };
import { collection }  from './-private/properties/collection';    export { collection };
import { contains }    from './-private/properties/contains';      export { contains };
import { count }       from './-private/properties/count';         export { count };
import { fillable }    from './-private/properties/fillable';      export { fillable }; export const selectable = fillable;
import { focusable }   from './-private/properties/focusable';     export { focusable };
import { hasClass }    from './-private/properties/has-class';     export { hasClass };
import { is }          from './-private/properties/is';            export { is };
import { isHidden }    from './-private/properties/is-hidden';     export { isHidden };
import { isPresent }   from './-private/properties/is-present';    export { isPresent };
import { isVisible }   from './-private/properties/is-visible';    export { isVisible };
import { notHasClass } from './-private/properties/not-has-class'; export { notHasClass };
import { property }    from './-private/properties/property';      export { property };
import { text }        from './-private/properties/text';          export { text };
import { triggerable } from './-private/properties/triggerable';   export { triggerable };
import { value }       from './-private/properties/value';         export { value };
import { visitable }   from './-private/properties/visitable';     export { visitable };

export { findElement } from './-private/extend/find-element';
export { findElementWithAssert } from './-private/extend/find-element-with-assert';
export { buildSelector, getContext } from './-private/helpers';

export default {
  attribute,
  blurrable,
  clickOnText,
  clickable,
  collection,
  contains,
  count,
  create,
  fillable,
  focusable,
  hasClass,
  is,
  isHidden,
  isPresent,
  isVisible,
  notHasClass,
  property,
  selectable,
  text,
  value,
  visitable,
  triggerable
};
