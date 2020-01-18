import { TestContext as BaseTestContext } from 'ember-test-helpers';

interface TestContext extends BaseTestContext {
  adapter: any
}

type TestCallback = (testName: string, cb: (this: TestContext, assert: Assert) => any) => any;

type ModuleCallback = (callback: TestCallback, adapter: any) => any;

export function moduleForProperty(name: string, cbOrOptions: ModuleCallback|object, cb?: ModuleCallback): void;
