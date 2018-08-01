import { create } from "ember-cli-page-object";

function selectorQuery() {
  create(""); // $ExpectError
  create({ scope: 1 }); // $ExpectError
  create({ testContainer: 111 }); // $ExpectError
  create({ resetScope: 111 }); // $ExpectError

  create();
  create({});
  create({ scope: "" });
  create({ testContainer: "" });
  create({ testContainer: document.createElement('div') });
  create({ resetScope: true });
}

function createDefault() {
  const a = create({
    uniqProp: 1
  });

  a.uniqProp;

  a.isVisible!; // $ExpectType boolean
  a.isPresent!; // $ExpectType boolean
  a.isHidden!; // $ExpectType boolean

  a.text!; // ExpectType string
  a.value!; // ExpectType string

  function contains() {
    a.contains(); // $ExpectError
    a.contains(1); // $ExpectError

    (): boolean => a.contains('conained text');
  }

  function click() {
    a.uniqProp;
    a.click().click();
    (): number => a.click().uniqProp;
  }

  function fillIn() {
    a.fillIn(); // $ExpectError
    a.fillIn(1); // $ExpectError

    (): typeof a =>
      a.fillIn('string')
        .fillIn('clue', 'string');
  }

  function clickOn() {
    a.clickOn(); // $ExpectError
    a.clickOn(1); // $ExpectError

    (): typeof a => a.clickOn('text');
  }

  function focus() {
    (): typeof a => a.focus();
  }

  function blur() {
    (): typeof a => a.blur();
  }
}

function nestingTest() {
  const nested = create({
    b: {
      prop: "1"
    }
  });

  nested.b; // $ExpectType Component<{ prop: string; }>
}
