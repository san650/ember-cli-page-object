import {
  create,
  triggerable,
  focusable,
  hasClass
} from "ember-cli-page-object";

const a = {
  do1: triggerable('eventname', '.Selector'),
};

const Def = {
  scope: '.AComponent',

  a,

  hasSomething: hasClass('.aclass'),

  do2: focusable()
}

const page = create(Def);

page.isVisible;
page.click().a.do1();
page.a.click()

page.do2().click();
page.do2().a

// !!!!!!!!!!!!!!!!
// SHOULD FAIL
// !!!!!!!!!!!!!!!!
page.click().isVisible
page.isVisible.b
page.isVisible.click();

create({
  scope: 13
});
