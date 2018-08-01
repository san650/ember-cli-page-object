import { getter } from "ember-cli-page-object/macros";
import { create } from "ember-cli-page-object";

const a = create({
  number: getter(function() {
    return 1;
  }),

  // impossible to preserve this :(
  numberExtra: getter(function(this: any): string {
    return this.number;
  }),

  // we have to make sure objects returned from getter
  // are not treated as page object configs
  map: getter(function() {
    return { a: 1 };
  })
});

a.number; // $ExpectType number
a.numberExtra; // $ExpectType string
a.map; // $ExpectType { a: number; }
