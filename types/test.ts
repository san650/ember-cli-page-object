import {
  Component,
  create,
  focusable,
  hasClass
} from "ember-cli-page-object";

create({});
create({scope: ""});

create({ scope: 1 }); // $ExpectError
create(); // $ExpectError
create(""); // $ExpectError

class Def {
  hasSomething = hasClass(".aclass");

  do2 = focusable<this>();

  constructor(public scope = ".AComponent") {}

  do3(this: Component<Def>) {
    return this.hasSomething;
  }

  do4(this: Component<Def>) {
    return this.do2().click().do1();
  }
}

const page = create(new Def());

page.isVisible;
page.click().isVisible;
page.click().a.do1();
page.do2().a.do1();
page.a.click();

page.isVisible.b; // $ExpectError
page.isVisible.click(); // $ExpectError

// SHOULD also fail but it doesn't
page.click().SHOULD_FAIL();
