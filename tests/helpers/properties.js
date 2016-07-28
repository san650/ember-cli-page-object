import { AcceptanceAdapter, moduleForAcceptance, testForAcceptance } from './properties/acceptance-adapter';
import { IntegrationAdapter, moduleForIntegration, testForIntegration } from './properties/integration-adapter';

export function moduleForProperty(name, cb) {
  // Generate acceptance tests
  let acceptanceAdapter = new AcceptanceAdapter();
  moduleForAcceptance(`Acceptance mode | Property | ${name}`, {
    afterEach() {
      acceptanceAdapter.revert();
    }
  });
  cb(testForAcceptance, acceptanceAdapter);

  // Generate integration tests
  let integrationAdapter = new IntegrationAdapter();
  moduleForIntegration('html-render', `Integration mode | Property | ${name}`, {
    integration: true,
    afterEach() {
      integrationAdapter.revert();
    }
  });
  cb(testForIntegration, new IntegrationAdapter());
}
