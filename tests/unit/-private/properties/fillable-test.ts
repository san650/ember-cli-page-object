import { moduleForProperty } from '../../../helpers/properties';
import { create, fillable, selectable } from 'ember-cli-page-object';

moduleForProperty('fillable', function(test) {
  test("calls fillIn method belonging to execution context", async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page;

    page = create({
      foo: fillable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input>');

    await this.adapter.await(page.foo(expectedText));

    assert.equal(this.adapter.$(expectedSelector).val(), expectedText);
  });

  const targetAttributes = ['data-test', 'aria-label', 'placeholder', 'name', 'id'];

  const formControlTemplates = [
    '<input data-test="clue" />',
    '<input aria-label="clue" />',
    '<input placeholder="clue" />',
    '<input name="clue" />',
    '<input id="clue" />',

    '<textarea data-test="clue"></textarea>',
    '<textarea aria-label="clue"></textarea>',
    '<textarea placeholder="clue"></textarea>',
    '<textarea name="clue"></textarea>',
    '<textarea id="clue"></textarea>',

    '<select data-test="clue"><option></option><option>dummy text</option></select>',
    '<select aria-label="clue"><option></option><option>dummy text</option></select>',
    '<select placeholder="clue"><option></option><option>dummy text</option></select>',
    '<select name="clue"><option></option><option>dummy text</option></select>',
    '<select id="clue"><option></option><option>dummy text</option></select>',
  ];

  formControlTemplates.forEach(template => {
    let gtPos = template.indexOf('=');
    let name = template.substr(1, gtPos - 1);
    const [tagName, attrName] = name.split(' ');

    test(`looks for ${tagName} with ${attrName}`, async function(assert) {
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      await this.adapter.createTemplate(this, page, `<div class="scope">${template}</div>`);

      await this.adapter.await(page.foo(clue, expectedText));

      assert.equal(this.adapter.$(`${tagName}[${attrName}="${clue}"]`).val(), expectedText);
    });
  });

  targetAttributes.forEach(attrName => {
    test(`looks for [contenteditable] with ${attrName}`, async function(assert) {
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      await this.adapter.createTemplate(this, page, `<div class="scope"><div contenteditable ${attrName}="clue"></div></div>`);

      await this.adapter.await(page.foo(clue, expectedText));

      assert.equal(this.adapter.$(`div[${attrName}="${clue}"]`).html(), expectedText);
    });
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { scope: '.scope' })
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    await this.adapter.await(page.foo('dummy text'));

    assert.equal(this.adapter.$('.scope input').val(), 'dummy text');
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: fillable('input')
    });

    await this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    await this.adapter.await(page.foo('dummy text'));

    assert.equal(this.adapter.$('.scope input').val(), 'dummy text');
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: fillable('input', { resetScope: true })
    });

    await this.adapter.createTemplate(this, page, '<input>');

    await this.adapter.await(page.foo('dummy text'));

    assert.equal(this.adapter.$('input').val(), 'dummy text');
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input')
    });

    await this.adapter.createTemplate(this, page, '<input>');

    let ret = page.foo('dummy text');
    assert.ok(ret.foo);
    await this.adapter.await(ret);
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: fillable('input', { at: 3 })
    });

    await this.adapter.createTemplate(this, page, '<input><input><input><input>');

    await this.adapter.await(page.foo('dummy text'));

    assert.equal(this.adapter.$(expectedSelector).val(), 'dummy text');
  });

  test('is aliased to selectable', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page = create({
      foo: selectable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input>');

    await this.adapter.await(page.foo(expectedText));

    assert.equal(this.adapter.$(expectedSelector).val(), expectedText);
  });

  test('looks for elements outside the testing container', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      foo: fillable(expectedSelector, { testContainer: expectedContext })
    });

    await this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    await this.adapter.await(page.foo(expectedText));

    assert.equal(this.adapter.$(expectedSelector, expectedContext).val(), expectedText);
  });

  test('looks for elements within test container specified at node level', async function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      testContainer: expectedContext,
      foo: fillable(expectedSelector)
    });

    await this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    await this.adapter.await(page.foo(expectedText));

    assert.equal(this.adapter.$(expectedSelector, expectedContext).val(), expectedText);
  });

  test("raises an error when the element doesn't exist", async function(assert) {
    assert.expect(1);

    let page = create({
      foo: {
        bar: {
          baz: {
            qux: fillable('input')
          }
        }
      }
    });

    await this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('lorem');
    }, /page\.foo\.bar\.baz\.qux\(\)/, 'Element not found');
  });

  test('raises an error when the element has contenteditable="false"', async function(assert) {
    let page = create({
      foo: fillable('[contenteditable]')
    });

    await this.adapter.createTemplate(this, page, '<div contenteditable="false">');

    await this.adapter.throws(assert, function() {
      return page.foo('lorem');
    }, /contenteditable/, 'Element should not be fillable because contenteditable="false"');
  });
});
