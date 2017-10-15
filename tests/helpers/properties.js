import { AcceptanceAdapter, moduleForAcceptance, testForAcceptance } from './properties/acceptance-adapter';
import { IntegrationAdapter, moduleForIntegration, testForIntegration } from './properties/integration-adapter';

export function moduleForProperty(name, cbOrOptions, cb) {
  let options = cb ? cbOrOptions : {};
  cb = cb || cbOrOptions;

  // Generate acceptance tests
  moduleForAcceptance(`Acceptance mode | Property | ${name}`, {
    beforeEach() {
      this.adapter = new AcceptanceAdapter(this);
    },

    afterEach() {
      this.adapter.revert();
    }
  });
  cb(testForAcceptance, 'acceptance');

  if (options.acceptanceOnly) {
    return;
  }

  // Generate integration tests
  moduleForIntegration('html-render', `Integration mode | Property | ${name}`, {
    integration: true,
    beforeEach() {
      this.adapter = new IntegrationAdapter(this);
    },

    afterEach() {
      this.adapter.revert();
    }
  });
  cb(testForIntegration, 'integration');
}
