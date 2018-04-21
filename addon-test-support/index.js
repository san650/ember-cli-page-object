import { create }      from './create';                   export { create };

import { attribute }   from './properties/attribute';     export { attribute };
import { blurrable }   from './properties/blurrable';     export { blurrable };
import { clickOnText } from './properties/click-on-text'; export { clickOnText };
import { clickable }   from './properties/clickable';     export { clickable };
import { collection }  from './properties/collection';    export { collection };
import { contains }    from './properties/contains';      export { contains };
import { count }       from './properties/count';         export { count };
import { fillable }    from './properties/fillable';      export { fillable }; export const selectable = fillable;
import { focusable }   from './properties/focusable';     export { focusable };
import { hasClass }    from './properties/has-class';     export { hasClass };
import { is }          from './properties/is';            export { is };
import { isHidden }    from './properties/is-hidden';     export { isHidden };
import { isPresent }   from './properties/is-present';    export { isPresent };
import { isVisible }   from './properties/is-visible';    export { isVisible };
import { notHasClass } from './properties/not-has-class'; export { notHasClass };
import { property }    from './properties/property';      export { property };
import { text }        from './properties/text';          export { text };
import { triggerable } from './properties/triggerable';   export { triggerable };
import { value }       from './properties/value';         export { value };
import { visitable }   from './properties/visitable';     export { visitable };

export { findElement } from './extend/find-element';
export { findElementWithAssert } from './extend/find-element-with-assert';
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
