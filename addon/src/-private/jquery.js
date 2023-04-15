import { importSync } from '@embroider/macros';

let jQuery;

if (window.jQuery) {
  jQuery = window.jQuery;
} else {
  const jqueryImport = importSync('jquery');
  jQuery = jqueryImport.default;
}

export { jQuery as $ };
