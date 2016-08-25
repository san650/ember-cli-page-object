import { moduleForProperty } from '../helpers/properties';
import { create, text } from 'ember-cli-page-object';

moduleForProperty('create', function(test, adapter) {
  test('creates new page object', function(assert) {
    let page = create({
      foo: 'a value',
      bar: {
        baz: 'another value'
      }
    });

    adapter.createTemplate(this, page);

    assert.equal(page.foo, 'a value');
    assert.equal(page.bar.baz, 'another value');
  });

  if (adapter.name === 'acceptance') {
    test('generates default visit helper', function(assert) {
      assert.expect(1);

      let page = create('/foo');

      adapter.createTemplate(this, page);

      adapter.visit((path) => {
        assert.equal(path, '/foo');
      });

      page.visit();
    });

    test('generates default visit helper plus a definition', function(assert) {
      assert.expect(2);

      let page = create('/foo', { foo: text('span') });

      adapter.createTemplate(this, page, '<span>dummy text</span>');

      adapter.visit((path) => {
        assert.equal(path, '/foo');
      });

      page.visit();
      assert.equal(page.foo, 'dummy text');
    });
  }

  test('resets scope', function(assert) {
    let page = create({
      scope: '.invalid-scope',

      foo: {
        scope: '.scope',
        resetScope: true,
        bar: text()
      }
    });

    adapter.createTemplate(this, page, `
      <div>
        <span class="scope">Lorem</span>
      </div>
    `);

    assert.equal(page.foo.bar, 'Lorem');
  });

  test('does not mutate definition object', function(assert) {
    let prop = text('.baz');
    let expected = {
      context: '.a-context',
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };
    let actual = {
      context: '.a-context',
      scope: '.a-scope',
      foo: {
        baz: prop
      },

      bar: prop
    };

    let page = create(actual);

    adapter.createTemplate(this, page);

    assert.deepEqual(actual, expected);
  });

  test('generates a default scope', function(assert) {
    let page = create({});

    adapter.createTemplate(this, page, '<p>Lorem ipsum</p>');

    assert.ok(page.contains('ipsum'));
  });
});
