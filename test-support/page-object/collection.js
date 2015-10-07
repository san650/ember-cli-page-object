import Ember from 'ember';
import Descriptor from './descriptor';
import { build } from './build';
import count from './properties/count';
import {
  qualifySelector
} from './helpers';

let copy = Ember.copy;

function isNullOrUndefined(value) {
  return typeof(value) === 'undefined' || value === null;
}

function scopeWithIndex(base, index) {
  return `${base}:eq(${index - 1})`;
}

function extract(object, name) {
  let attribute = object[name];

  delete object[name];

  return attribute;
}

function preProcess(target, key, options) {
  let definition = extract(options, 'definition');

  options.itemDefinition = extract(definition, 'item');
  options.itemScope = extract(definition, 'itemScope');

  if (isNullOrUndefined(definition.scope)) {
    definition.scope = definition.scope || target.scope;
  }

  options.scope = definition.scope;

  if (!definition.count) {
    definition.count = count(options.itemScope);
  }

  options.collectionComponent = build(definition);
}

function getCollection(target, key, options, index) {
  let component;

  if (index === 0) {
    throw new Error('ember-cli-page-object collections are 1-based arrays. Use index 1 to access the first item.');
  }

  if (index) {
    component = copy(options.itemDefinition);
    component.scope = qualifySelector(options.scope, scopeWithIndex(options.itemScope, index));
    component = build(component);
  } else {
    component = options.collectionComponent;
  }

  return component;
}

export function collection(definition) {
  let options = { definition: copy(definition) };

  return new Descriptor(getCollection, options, preProcess);
}
