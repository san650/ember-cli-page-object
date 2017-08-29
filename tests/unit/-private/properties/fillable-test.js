import { moduleForProperty } from '../../../helpers/properties';
import { create, fillable, selectable } from 'ember-cli-page-object';

moduleForProperty('fillable', function(test) {
  test("calls fillIn method belonging to execution context", function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page;

    page = create({
      foo: fillable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input>');

    page.foo(expectedText);

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$(expectedSelector).val(), expectedText);
    });
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

    test(`looks for ${tagName} with ${attrName}`, function(assert) {
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      this.adapter.createTemplate(this, page, `<div class="scope">${template}</div>`);

      page.foo(clue, expectedText);

      return this.adapter.andThen(() => {
        assert.equal(this.adapter.$(`${tagName}[${attrName}="${clue}"]`).val(), expectedText);
      });
    });
  });

  targetAttributes.forEach(attrName => {
    test(`looks for [contenteditable] with ${attrName}`, function(assert) {
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      this.adapter.createTemplate(this, page, `<div class="scope"><div contenteditable ${attrName}="clue"></div></div>`);

      page.foo(clue, expectedText);

      return this.adapter.andThen(() => {
        assert.equal(this.adapter.$(`div[${attrName}="${clue}"]`).html(), expectedText);
      });
    });
  });

  test('looks for elements inside the scope', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { scope: '.scope' })
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    page.foo('dummy text');

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$('.scope input').val(), 'dummy text');
    });
  });

  test("looks for elements inside page's scope", function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: fillable('input')
    });

    this.adapter.createTemplate(this, page, '<div class="scope"><input></div>');

    page.foo('dummy text');

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$('.scope input').val(), 'dummy text');
    });
  });

  test('resets scope', function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: fillable('input', { resetScope: true })
    });

    this.adapter.createTemplate(this, page, '<input>');

    page.foo('dummy text');

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$('input').val(), 'dummy text');
    });
  });

  test('returns target object', function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input')
    });

    this.adapter.createTemplate(this, page, '<input>');

    assert.equal(page.foo(), page);
  });

  test('finds element by index', function(assert) {
    assert.expect(1);

    let expectedSelector = 'input:eq(3)';
    let page = create({
      foo: fillable('input', { at: 3 })
    });

    this.adapter.createTemplate(this, page, '<input><input><input><input>');

    page.foo('dummy text');

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$(expectedSelector).val(), 'dummy text');
    });
  });

  test('is aliased to selectable', function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page = create({
      foo: selectable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input>');

    page.foo(expectedText);

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$(expectedSelector).val(), expectedText);
    });
  });

  test('looks for elements outside the testing container', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      foo: fillable(expectedSelector, { testContainer: expectedContext })
    });

    this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    page.foo(expectedText);

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$(expectedSelector, expectedContext).val(), expectedText);
    });
  });

  test('looks for elements within test container specified at node level', function(assert) {
    assert.expect(1);

    let expectedContext = '#alternate-ember-testing';
    let expectedSelector = 'input';
    let expectedText = 'foo';
    let page = create({
      testContainer: expectedContext,
      foo: fillable(expectedSelector)
    });

    this.adapter.createTemplate(this, page, '<input>', { useAlternateContainer: true });

    page.foo(expectedText);

    return this.adapter.andThen(() => {
      assert.equal(this.adapter.$(expectedSelector, expectedContext).val(), expectedText);
    });
  });

  test("raises an error when the element doesn't exist", function(assert) {
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

    this.adapter.createTemplate(this, page);

    this.adapter.throws(assert, function() {
      return page.foo.bar.baz.qux('lorem');
    }, /page\.foo\.bar\.baz\.qux\(\)/, 'Element not found');
  });

  test('raises an error when the element has contenteditable="false"', function(assert) {
    let page = create({
      foo: fillable('div')
    });

    this.adapter.createTemplate(this, page, '<div contenteditable="false">');

    this.adapter.throws(assert, function() {
      return page.foo('lorem');
    }, /contenteditable="false"/, 'Element should not be fillable because contenteditable="false"');
  });
});
