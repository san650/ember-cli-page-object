import Component from '@ember/component';
import { later } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

function spyAction(assert) {
  let i = 0;

  return () => {
    let id = i++;

    assert.step(`begin #${id}`);

    return later(() => {
      assert.step(`complete #${id}`);
    }, 100)
  };
}

export function createClickTrackerComponent(assert) {
  const trackAction = spyAction(assert);

  const layout = hbs`<input onclick={{action "trackAction"}}>`

  return Component.extend({
    layout,

    actions: {
      trackAction() {
        return trackAction();
      }
    }
  });
}

export const ClickTrackerDef = {
  scope: 'input'
};
