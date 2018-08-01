import { create, clickable } from "ember-cli-page-object";

const a = create({
  extraProp: clickable(),
  number: 1
});

function chainingTest2(): typeof a {
  return a.click().extraProp();
}

function thenableChainingTest(): typeof a {
  return a.click().then((a) => a.extraProp());
}
