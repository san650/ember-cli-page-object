import { run } from '@ember/runloop';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  let application;

  let attributes = Object.assign({}, config.APP);
  attributes.autoboot = true;
  attributes = Object.assign(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
