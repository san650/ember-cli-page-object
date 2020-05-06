import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { create } from 'ember-cli-page-object';
import { findElement } from 'ember-cli-page-object/extend';
import hbs from 'htmlbars-inline-precompile';
import require from 'require';

if (require.has('@ember/test-helpers')) {
  module(`Extend | findElement`, function(hooks) {
    setupRenderingTest(hooks);

    test('finds by selector and returns jQuery elements collection', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem">1</em><span class="ipsum">2</span>`);

      const foundElements = findElement(page, '.lorem');

      assert.equal(foundElements.length, 1);
      assert.ok(foundElements.jquery);
      assert.deepEqual(
        foundElements.toArray().map((el) => el.innerText),
        ['1']
      );
    });

    test('finds deeper in scope', async function(assert) {
      let page = create({ scope: '.lorem' });

      await this.render(hbs`
      <em class="lorem">
        <span class="dolor">1</span>
      </em>
      <span class="ipsum">
        <span class="dolor">2</span>
      </span>
    `);

      const foundElements = findElement(page, '.dolor');
      assert.equal(foundElements.length, 1);
      assert.deepEqual(
        foundElements.toArray().map((e) => e.innerText),
        ['1']
      );
    });

    test('returns empty list when no elements found', async function(assert) {
      let page = create({});

      await this.render(hbs`<em class="lorem"></em>`);

      assert.deepEqual(findElement(page, '.ipsum', {}).length, 0);
    });

    test('testContainer param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="ipsum">1</span>
        <div class="new-test-root">
          <span class="ipsum">2</span>
        </div>
      `);

      assert.deepEqual(
        findElement(page, '.ipsum', {
          testContainer: '.new-test-root'
        }).toArray().map(e => e.innerText),
        ['2']
      );
    });

    test('resetScope param', async function(assert) {
      let page = create({ scope: 'my-page' });

      await this.render(hbs`
        <span class="lorem">1</span>
        <div class="my-page">
          <span class="ipsum">2</span>
          <span class="ipsum">3</span>
        </div>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { resetScope: true }).toArray().map((el) => el.innerText),
        ['1']
      );
    });

    test('contains param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem" id="1"></span>
        <span class="lorem" id="2">Word</span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { contains: 'Word' }).toArray().map((el) => el.id),
        ['2']
      );
    });

    test('scope param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem">1</span>
        <span class="ipsum">
          <span class="lorem">2</span>
        </span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { scope: '.ipsum' }).toArray().map((el) => el.innerText),
        ['2']
      );
    });

    test('visible param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem" style="display:none">1</span>
        <span class="lorem">2</span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { visible: true }).toArray().map((el) => el.innerText),
        ['2']
      );
    });

    test('at param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem">1</span>
        <span class="lorem">2</span>
        <span class="lorem">3</span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { at: 1 }).toArray().map((el) => el.innerText),
        ['2']
      );
    });

    test('last param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem">1</span>
        <span class="lorem">2</span>
        <span class="lorem">3</span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { last: true }).toArray().map((el) => el.innerText),
        ['3']
      );
    });

    test('multiple param', async function(assert) {
      let page = create({});

      await this.render(hbs`
        <span class="lorem">1</span>
        <span class="lorem">2</span>
        <span class="lorem">3</span>
      `);

      assert.deepEqual(
        findElement(page, '.lorem', { multiple: true }).toArray().map((el) => el.innerText),
        ['1', '2', '3']
      );
    });
  });
}
