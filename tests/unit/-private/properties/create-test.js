import { setupTestModuleForProperty } from '../../../helpers/properties';
import { create, text } from 'ember-cli-page-object';

setupTestModuleForProperty('create', function(test, adapter) {
  test('creates new page object', async function(assert) {
    let page = create({
      foo: 'a value',
      bar: {
        baz: 'another value'
      }
    });

    await this.adapter.createTemplate(this, page);

    assert.equal(page.foo, 'a value');
    assert.equal(page.bar.baz, 'another value');
  });

  if (adapter === 'acceptance' || adapter === 'application') {
    test('generates default visit helper', async function(assert) {
      assert.expect(1);

      let page = create('/html-render');

      await this.adapter.createTemplate(this, page);

      await page.visit();
      assert.equal(this.adapter.currentURL(), '/html-render');
    });

    test('generates default visit helper plus a definition', async function(assert) {
      assert.expect(2);

      let page = create('/html-render', { foo: text('span') });

      await this.adapter.createTemplate(this, page, '<span>dummy text</span>');

      await page.visit();
      assert.equal(this.adapter.currentURL(), '/html-render');
      assert.equal(page.foo, 'dummy text');
    });
  }

  test('resets scope', async function(assert) {
    let page = create({
      scope: '.invalid-scope',

      foo: {
        scope: '.scope',
        resetScope: true,
        bar: text()
      }
    });

    await this.adapter.createTemplate(this, page, `
      <div>
        <span class="scope">Lorem</span>
      </div>
    `);

    assert.equal(page.foo.bar, 'Lorem');
  });

  test('does not mutate definition object', async function(assert) {
    let prop = text('.baz');
    let expected = {
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };
    let actual = {
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };

    let page = create(actual);

    await this.adapter.createTemplate(this, page);

    assert.deepEqual(actual, expected);
  });

  test('generates a default scope', async function(assert) {
    let page = create({});

    await this.adapter.createTemplate(this, page, '<p>Lorem ipsum</p>');

    assert.ok(page.contains('ipsum'));
  });

  test('"context" key is not allowed', async function(assert) {
    assert.throws(() => create({
      context: {}
    }), new Error('"context" key is not allowed to be passed at definition root.'));
  });
});
