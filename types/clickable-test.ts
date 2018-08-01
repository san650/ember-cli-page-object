import { create, clickable } from 'ember-cli-page-object';

function itWorks() {
  const p = create({
    default: clickable(),
    withSelector: clickable('test-selector'),
    withUserOptions: clickable('test-selector', {
      pageObjectKey: '123',
      resetScope: false,
      testContainer: 'body',
      contains: '123',
      last: false,
      at: 1,
      multiple: false,
      visible: true
    }),
  });

  (): typeof p => p.click();
  (): typeof p => p.default();
  (): typeof p => p.withSelector();
  (): typeof p => p.withUserOptions();
}

function userOptionsErrors() {
  clickable('invalid type', { at: '1' }); // $ExpectError
  clickable('unknown option', { unkown: '1' }); // $ExpectError
}
