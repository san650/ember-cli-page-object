import { setupRenderingTest, TestContext } from '../../../helpers';
import { create, fillable, selectable } from 'ember-cli-page-object';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('fillable', function(hooks) {
  setupRenderingTest(hooks);

  test("calls fillIn method belonging to execution context", async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page;

    page = create({
      foo: fillable(expectedSelector)
    });

    await render(hbs`<input>`);

    await page.foo(expectedText);

    assert.equal((find(expectedSelector) as HTMLInputElement).value, expectedText);
  });

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

    test(`looks for ${tagName} with ${attrName}`, async function(this: TestContext, assert) {
      ( this as any ).template = template;
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      await this.createTemplate(`<div class="scope">${this['template']}</div>`);

      await page.foo(clue, expectedText);

      assert.equal(
        (find(`${tagName}[${attrName}="${clue}"]`) as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement).value,
        expectedText
      );
    });
  });

  const targetAttributes = ['data-test', 'aria-label', 'placeholder', 'name', 'id'];
  targetAttributes.forEach(attrName => {
    test(`looks for [contenteditable] with ${attrName}`, async function(this: TestContext, assert) {
      let expectedText = 'dummy text';
      let clue = 'clue';
      let page = create({
        scope: '.scope',
        foo: fillable()
      });

      this[attrName] = attrName;

      await this.createTemplate(`<div class="scope">
        <div contenteditable ${this[attrName]}="clue"></div>
      </div>`);

      await page.foo(clue, expectedText);

      assert.equal(find(`div[${attrName}="${clue}"]`)!.innerHTML, expectedText);
    });
  });

  test('looks for elements inside the scope', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { scope: '.scope' })
    });

    await render(hbs`<div class="scope"><input></div>`);

    await page.foo('dummy text');

    assert.equal((find('.scope input') as HTMLInputElement).value, 'dummy text');
  });

  test("looks for elements inside page's scope", async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',

      foo: fillable('input')
    });

    await render(hbs`<div class="scope"><input></div>`);

    await page.foo('dummy text');

    assert.equal((find('.scope input') as HTMLInputElement).value, 'dummy text');
  });

  test('resets scope', async function(assert) {
    assert.expect(1);

    let page = create({
      scope: '.scope',
      foo: fillable('input', { resetScope: true })
    });

    await render(hbs`<input>`);

    await page.foo('dummy text');

    assert.equal((find('input') as HTMLInputElement).value, 'dummy text');
  });

  test('returns chainable object', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input')
    });

    await render(hbs`<input>`);

    let ret = page.foo('dummy text');
    assert.ok(ret.foo);
    await ret;
  });

  test('finds element by index', async function(assert) {
    assert.expect(1);

    let page = create({
      foo: fillable('input', { at: 3 })
    });

    await render(hbs`<input><input><input><input>`);

    await page.foo('dummy text');

    assert.equal((find('input:nth-of-type(4)') as HTMLInputElement).value, 'dummy text');
  });

  test('is aliased to selectable', async function(assert) {
    assert.expect(1);

    let expectedSelector = 'input';
    let expectedText = 'dummy text';
    let page = create({
      foo: selectable(expectedSelector)
    });

    await render(hbs`<input>`);

    await page.foo(expectedText);

    assert.equal((find(expectedSelector) as HTMLInputElement).value, expectedText);
  });

  test('looks for elements outside the testing container', async function(this: TestContext, assert) {
    assert.expect(1);

    let expectedText = 'foo';
    let page = create({
      foo: fillable('input', { testContainer: '#alternate-ember-testing' })
    });

    await this.createTemplate(`<input>`, { useAlternateContainer: true });

    await page.foo(expectedText);

    assert.equal(this.findExternal<HTMLInputElement>('input')?.value, expectedText);
  });

  test('looks for elements within test container specified at node level', async function(this: TestContext, assert) {
    assert.expect(1);

    let expectedText = 'foo';
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: fillable('input')
    });

    await this.createTemplate(`<input>`, { useAlternateContainer: true });

    await page.foo(expectedText);

    assert.equal(this.findExternal<HTMLInputElement>('input')?.value, expectedText);
  });

  test(`raises an error when can't find an element by clue`, async function(assert) {
    let clue = 'clue';

    let page = create({
      scope: '.scope',
      fillInByClue: fillable()
    });

    await render(hbs``);

    return assert.throws(() => {
      return page.fillInByClue(clue, 'dummy text');
    }, /Can\ not\ find\ element\ by\ clue:\ \"clue\"\./);
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

    await render(hbs``);

    assert.throws(
      () => {
        return page.foo.bar.baz.qux('lorem') as unknown as Promise<unknown>;
      },
      /page\.foo\.bar\.baz\.qux\("lorem"\)/,
      'Element not found'
    );
  });

  test('raises an error when the element has contenteditable="false"', async function(assert) {
    let page = create({
      foo: fillable('[contenteditable]')
    });

    await render(hbs`<div contenteditable="false"></div>`);

    await assert.rejects(
      page.foo('lorem') as unknown as Promise<unknown>,
      /contenteditable/,
      'Element should not be fillable because contenteditable="false"'
    );
  });
});
