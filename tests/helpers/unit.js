import { moduleForComponent, test as testForComponent } from 'ember-qunit';
import { test as testForAcceptance } from 'qunit';
import { AcceptanceAdapter, moduleForAcceptance } from './acceptance-adapter';
import { IntegrationAdapter } from './integration-adapter';

let k = function() {};
let moduleDefinition;
let testsDefinitions;

export function module(name, options = {}) {
  if (moduleDefinition) {
    console.error('You forgot to call `finish()` at the end of a unit tests file.');
  }

  moduleDefinition = {
    name,
    options: {
      beforeEach: options.beforeEach || k,
      afterEach: options.afterEach || k
    }
  };
}

export function test(name, fn) {
  if (!testsDefinitions) {
    testsDefinitions = [];
  }

  testsDefinitions.push({ name, fn });
}

function generateTest(generator, definition) {
  generator(definition.name, function(assert) {
    definition.fn.call(this, assert, this.testUnitAdapter);
  });
}

export function finish() {
  let { options } = moduleDefinition;

  moduleForAcceptance(`${moduleDefinition.name} [acceptance]`,  {
    beforeEach() {
      this.testUnitAdapter = new AcceptanceAdapter();
      options.beforeEach.call(this);
    },

    afterEach() {
      options.afterEach.call(this);
      this.testUnitAdapter.revert();
    }
  });

  testsDefinitions.forEach(function(definition) {
    generateTest(testForAcceptance, definition);
  });

  moduleForComponent('html-render', `${moduleDefinition.name} [integration]`, {
    integration: true,

    beforeEach() {
      this.testUnitAdapter = new IntegrationAdapter();
      options.beforeEach.call(this);
    },

    afterEach() {
      options.afterEach.call(this);
      this.testUnitAdapter.revert();
    }
  });

  testsDefinitions.forEach(function(definition) {
    generateTest(testForComponent, definition);
  });

  moduleDefinition = null;
  testsDefinitions = null;
}
