import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers';
import { create } from 'ember-cli-page-object';
import { findOne } from 'ember-cli-page-object/extend';
import hbs from 'htmlbars-inline-precompile';
import { find, findAll, render } from '@ember/test-helpers';

module(`Extend | findOne`, function (hooks) {
  setupRenderingTest(hooks);

  test('finds by selector and returns Element', async function (assert) {
    const page = create({});

    await render(hbs`<em class="lorem"></em><span class="ipsum"></span>`);

    assert.equal(findOne(page, '.lorem', {}), find('.lorem'));
  });

  test('finds deeper in scope', async function (assert) {
    const page = create({ scope: '.lorem' });

    await render(
      hbs`<em class="lorem"><span class="dolor"></span></em><span class="ipsum"><span class="dolor"></span></span>`
    );

    assert.equal(findOne(page, '.dolor', {}), find('.lorem .dolor'));
  });

  test('throws error if more than 1 element found', async function (assert) {
    const page = create({});

    await render(
      hbs`<em class="lorem"></em><em class="lorem"></em><span class="ipsum"></span>`
    );

    assert.throws(
      () => findOne(page, '.lorem', {}),
      /Error: ".lorem" matched more than one element. If you want to select many elements, use collections instead./
    );
  });

  test('throws error if 0 elements found', async function (assert) {
    const page = create({
      child: {},
    });

    await render(hbs`<span class="ipsum"></span>`);

    assert.throws(
      () => findOne(page.child, '.unknown', {}),
      new Error(`Element not found.

PageObject: 'page.child'
  Selector: '.unknown'`)
    );
  });

  test('testContainer param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="ipsum"></span>
      <div class="new-test-root">
        <span class="ipsum"></span>
      </div>
    `);

    assert.equal(
      findOne(page, '.ipsum', { testContainer: '.new-test-root' }),
      find('.new-test-root .ipsum')
    );
  });

  test('resetScope param', async function (assert) {
    const page = create({ scope: 'my-page' });

    await render(hbs`
      <span class="lorem"></span>
      <div class="my-page">
        <span class="ipsum"></span>
      </div>
    `);

    assert.equal(findOne(page, '.lorem', { resetScope: true }), find('.lorem'));
  });

  test('at param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="lorem"></span>
    `);

    assert.equal(findOne(page, '.lorem', { at: 1 }), findAll('.lorem')[1]);
  });

  test('contains param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="lorem">Word</span>
    `);

    assert.equal(
      findOne(page, '.lorem', { contains: 'Word' }),
      findAll('.lorem')[1]
    );
  });

  test('last param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="lorem"><span class="lorem">Word</span></span>
    `);

    assert.equal(findOne(page, '.lorem', { last: true }), findAll('.lorem')[1]);
  });

  test('pageObjectKey param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="lorem"></span>
    `);

    assert.throws(
      () => findOne(page, '.unknown', { pageObjectKey: 'CUSTOM KEY' }),
      /PageObject: 'page.CUSTOM KEY'/
    );
  });

  test('scope param', async function (assert) {
    const page = create({});

    await render(hbs`
      <span class="lorem"></span>
      <span class="ipsum"><span class="lorem"></span></span>
    `);

    assert.equal(
      findOne(page, '.lorem', { scope: '.ipsum' }),
      find('.ipsum .lorem')
    );
  });

  module('comma separated selector', function () {
    const SELECTOR = 'comma, separated';

    test('page object with comma separated `scope`', async function (assert) {
      assert.throws(
        () => findOne(create({ scope: SELECTOR })),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        )
      );
    });

    test('comma separated `scope` argument', async function (assert) {
      assert.throws(
        () => findOne(create(), SELECTOR),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        )
      );
    });

    test('comma separated `scope` option', async function (assert) {
      assert.throws(
        () => findOne(create(), '', { scope: SELECTOR }),
        new Error(
          'Usage of comma separated selectors is not supported. Please make sure your selector targets a single selector.'
        )
      );
    });
  });
});
