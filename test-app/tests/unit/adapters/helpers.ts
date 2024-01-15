// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component';
import { later } from '@ember/runloop';
import hbs from 'htmlbars-inline-precompile';

function spyAction(assert: Assert) {
  let i = 0;

  return () => {
    const id = i++;

    assert.step(`begin #${id}`);

    return later(() => {
      assert.step(`complete #${id}`);
    }, 10);
  };
}

export function createClickTrackerComponent(assert: Assert) {
  const trackAction = spyAction(assert);

  const layout = hbs`<input onclick={{this.trackAction}}>`;

  return class TestComponent extends Component {
    layout = layout;

    trackAction = () => {
      return trackAction();
    };
  };
}

export const ClickTrackerDef = {
  scope: 'input',
};
