import { moduleForComponent, test } from 'ember-qunit';<% if (testType === 'integration') { %>
import hbs from 'htmlbars-inline-precompile';<% } %><% if (usePageObject) { %>
import { create } from 'ember-cli-page-object';
import <%= camelizedModuleName %> from '<%= pageObjectPath %>';

const component = create(<%= camelizedModuleName %>);<% } %>

moduleForComponent('<%= componentPathName %>', '<%= friendlyTestDescription %>', {
  <% if (testType === 'integration' ) { %>integration: true<% } else if(testType === 'unit') { %>// Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true<% } %><% if (usePageObject) { %>,
  beforeEach() {
    component.setContext(this);
  },

  afterEach() {
    component.removeContext();
  }<% } %>
});

test('it renders', function(assert) {
<% if (testType === 'integration' ) { %>
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{<%= componentPathName %>}}`);

  <% if (usePageObject) { %>assert.equal(component.text, '');<% } else { %>assert.equal(this.$().text().trim(), '');<% } %>

  // Template block usage:
  this.render(hbs`
    {{#<%= componentPathName %>}}
      template block text
    {{/<%= componentPathName %>}}
  `);

  <% if (usePageObject) { %>assert.equal(component.text, 'template block text');<% } else { %>assert.equal(this.$().text().trim(), 'template block text');<% } } else if(testType === 'unit') { %>
  // Creates the component instance
  /*let component =*/ this.subject();
  // Renders the component to the page
  this.render();
  assert.equal(this.$().text().trim(), '');<% } %>
});
