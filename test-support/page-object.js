import { attribute }   from 'ember-cli-page-object'; export { attribute };
import { clickOnText } from 'ember-cli-page-object'; export { clickOnText };
import { clickable }   from 'ember-cli-page-object'; export { clickable };
import { collection }  from 'ember-cli-page-object'; export { collection };
import { contains }    from 'ember-cli-page-object'; export { contains };
import { count }       from 'ember-cli-page-object'; export { count };
import { create }      from 'ember-cli-page-object'; export { create };
import { fillable }    from 'ember-cli-page-object'; export { fillable, fillable as selectable };
import { hasClass }    from 'ember-cli-page-object'; export { hasClass };
import { is }          from 'ember-cli-page-object'; export { is };
import { isHidden }    from 'ember-cli-page-object'; export { isHidden };
import { isVisible }   from 'ember-cli-page-object'; export { isVisible };
import { notHasClass } from 'ember-cli-page-object'; export { notHasClass };
import { property }    from 'ember-cli-page-object'; export { property };
import { text }        from 'ember-cli-page-object'; export { text };
import { triggerable } from 'ember-cli-page-object'; export { triggerable };
import { value }       from 'ember-cli-page-object'; export { value };
import { visitable }   from 'ember-cli-page-object'; export { visitable };

export { buildSelector, findElementWithAssert, findElement, getContext } from 'ember-cli-page-object';

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
  selectable: fillable,
  text,
  triggerable,
  value,
  visitable
};
