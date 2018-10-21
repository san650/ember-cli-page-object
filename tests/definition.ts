import {
  create,
  triggerable,
  ActionResult,
  fillable,
  Component,
  Definition
} from "ember-cli-page-object";

type Def = Definition & {
  trigger: () => ActionResult<Def>
  fillMe: (content: string) => ActionResult<Def>
  customMethod: (this: Component<Def>, param: string) => ActionResult<Def>
  customMethodAsync: (this: Component<Def>, param: string) => ActionResult<Def>
}

const A: Def = {
  trigger: triggerable('eventname', '.Selector'),

  fillMe: fillable(),

  customMethod(param: string) {
    return this
      .fillMe(param)
      .trigger();
  }

  async customMethodAsync(param: string) {
    return await this
      .fillMe(param)
      .trigger();
  }
};

const a = create(A);
a.customMethod('asdasda')
