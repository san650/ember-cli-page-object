import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { create, fillable } from 'ember-cli-page-object';

import require from 'require';
import RenderingAdapter from '../../helpers/properties/rendering-adapter';
if (require.has('@ember/test-helpers')) {

  module('fillable', function(hooks) {
    setupRenderingTest(hooks);

    const { createTemplate, throws } = new RenderingAdapter();

    module('clue', function() {
      test(`by clue: raises an error when can't find an element by clue`, async function(assert) {
        let clue = 'clue';
        const expectedMessage = `Element not found.

PageObject: 'page.fillInByClue()'
  Selector: '.scope input[data-test="${clue}"],.scope input[aria-label="${clue}"],.scope input[placeholder="${clue}"],.scope input[name="${clue}"],.scope input#${clue},.scope textarea[data-test="${clue}"],.scope textarea[aria-label="${clue}"],.scope textarea[placeholder="${clue}"],.scope textarea[name="${clue}"],.scope textarea#${clue},.scope select[data-test="${clue}"],.scope select[aria-label="${clue}"],.scope select[placeholder="${clue}"],.scope select[name="${clue}"],.scope select#${clue},.scope [contenteditable][data-test="${clue}"],.scope [contenteditable][aria-label="${clue}"],.scope [contenteditable][placeholder="${clue}"],.scope [contenteditable][name="${clue}"],.scope [contenteditable]#${clue}'`;

        let page = create({
          scope: '.scope',
          fillInByClue: fillable()
        });

        await createTemplate(this, page, ``);

        await throws(assert, function() {
          return page.fillInByClue(clue, 'dummy text');
        }, function(e) {
          return e.message === expectedMessage;
        }, 'Not found error with a full selector has been raised');
      });
    })
  });
}
