import hbs from 'htmlbars-inline-precompile';

export function createCalculatorTemplate() {
  return hbs`{{calculating-device}}`;
}

export function createInputsTemplate() {
  return hbs`{{input-elements}}`;
}
