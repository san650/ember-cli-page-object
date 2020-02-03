// Types for compiled templates
declare module 'ember-cli-page-object/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '-jquery' {
  export { default } from "jquery";
}
