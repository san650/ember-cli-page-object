import { run } from '@ember/runloop';
import { merge as assign } from '@ember/polyfills';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  let application;

  let attributes = assign({}, config.APP);
  attributes.autoboot = true;
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
