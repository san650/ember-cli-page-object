// TypeScript Version: 2.8
declare module 'ember-cli-page-object' {
  function attribute(attributeName?: string, scope?: string): string;
  function isVisible(scope?: string): boolean;
  function text(scope?: string): string;
  function value(scope?: string): string;
  function property(scope?: string, name?: string): string|number;
  function hasClass(className: string): boolean;
  function hasClass(scope: string, className: string): boolean;
  function contains(): (text: string) => boolean;

  function clickable<T>(scope?: string): (this: T) => Component<T>;
  function clickOnText<T>(scope?: string, userOptions?: FindOptions): (this: T, text: string) => Component<T>;
  function fillable<T>(scope?: string, userOptions?: FindOptions): (this: T, content: string) => Component<T>;
  function fillable<T>(scope?: string, userOptions?: FindOptions): (this: T, clue: string, content: string) => Component<T>;
  function triggerable<T>(event: string, scope?: string, eventOptions?: TriggerOptions): (this: T) => Component<T>;
  function focusable<T>(scope?: string): (this: T) => Component<T>;
  function blurrable<T>(scope?: string): (this: T) => Component<T>;
  function visitable<T>(path: string): (this: T, dynamicSegmentsAndQueryParams?: {}) => Component<T>;

  function collection<T extends Partial<Definition>>(scope: string, definition?: T): Collection<T>;
  function create<T extends Partial<Definition>>(definition: T): Component<T>;

  interface Collection<T> {
    <T>(scope: string, definition?: T): Array<Component<T>>;

    [i: number]: Component<T>;

    filter(callback: (c: Component<T>) => boolean): Array<Component<T>>;
    forEach(callback: (c: Component<T>) => any): void;
    map(callback: (c: Component<T>) => any): any[];
    toArray(): Array<Component<T>>;

    filterBy(propName: string): Array<Component<T>>;
    mapBy(propName: string): any[];
    objectAt(i: number): Component<T>;
  }

  type Component<T = {}> = DSL<T> & UnpackedDefinition<T> & {
    [s: string]: any;
  };

  interface DSL<T> {
    isHidden: boolean;
    isPresent: boolean;
    isVisible: boolean;
    text: string;
    value: string;

    blur(this: T): Component<T>;
    click(this: T): Component<T>;
    clickOn(this: T, text: string): Component<T>;
    contains(textToSearch: string): boolean;
    fillIn(this: T, contentOrClue: string, value?: string): Component<T>;
    focus(this: T): Component<T>;
  }

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends string|boolean|number|Function ? T[k]
      : T[k] extends object ? Component<T[k]>
      : T[k]
  };
}

declare module 'ember-cli-page-object/extend' {
  function findElement(pageObject: any, scope?: string, options?: FindOptions): any; // JQuery
  function findElementWithAssert(pageObject: any, scope?: string, options?: FindOptions): any; // JQuery
}

declare module 'ember-cli-page-object/macros' {
  function getter<T>(body: (...args: any[]) => T): T;
  function alias(path: string): any;
}

interface Definition {
  scope?: string;
  resetScope?: boolean;
  [l: string]: any;
}

interface ElementQuery {
  resetScope?: boolean;

  testContainer?: Element;

  pageObjectKey?: string;
}

interface FindOptions extends ElementQuery {
  contains?: string;

  last?: boolean;

  visible?: boolean;

  multiple?: boolean;

  at?: number;
}

interface TriggerOptions extends ElementQuery {
  eventProperties: object;
}
