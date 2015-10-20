import Ember from 'ember';
import Descriptor from './descriptor';
import { create } from './create';
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

  // don't mutate original definition
  definition = copy(definition);

  options.itemDefinition = extract(definition, 'item');
  options.itemScope = extract(definition, 'itemScope');

  if (isNullOrUndefined(definition.scope)) {
    definition.scope = target.scope;
  }

  options.scope = definition.scope;

  if (!definition.count) {
    definition.count = count(options.itemScope);
  }

  options.collectionComponent = definition;
}

function getCollection(target, key, options, index) {
  let component;

  if (index === 0) {
    throw new Error('ember-cli-page-object collections are 1-based arrays. Use index 1 to access the first item.');
  }

  if (index) {
    if (target.__forceScopeToChildren) {
      options.scope = target.scope;
    }

    component = copy(options.itemDefinition);
    component.scope = qualifySelector(options.scope, scopeWithIndex(options.itemScope, index));
    component.__forceScopeToChildren = true;
    component = create(component);
  } else {
    if (target.__forceScopeToChildren) {
      options.collectionComponent.scope = target.scope;
    }

    component = create(options.collectionComponent);
  }

  return component;
}

export function collection(definition) {
  let options = { definition: copy(definition) };

  return new Descriptor(getCollection, options, preProcess);
}
