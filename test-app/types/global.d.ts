// Types for compiled templates
declare module 'ember-cli-page-object/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module "ember-cli-page-object/-private/deprecate" {
  const deprecate: {
    (id: string, message: string, since: string, until: string): void;

    /**
     Stores list of argments for each `deprecate(` invocation.

     It's `undefined` by default, which means "invocations tracking is disabled".
     If you want to enable tracking, just initialize the `__calls` with an empty array, e.g:

     ```js
      deprecate.__calls = [];
     ```

     or disable it with

     ```js
      delete deprecate.__calls;
     ```
     */
    __calls?: string[][]
  };

  export default deprecate
}
