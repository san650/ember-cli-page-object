interface QueryOptions {
  resetScope: boolean

  contains: string

  last: boolean

  visible: boolean

  multiple: boolean

  testContainer: Element

  at: number

  pageObjectKey: string
}

interface TriggerOptions extends QueryOptions {
  eventProperties: object
}

declare module 'ember-cli-page-object' {
  interface KnownProps<T> extends KnownActions<T> {
    isVisible: boolean
    isPresent: boolean
    isHidden: boolean
    text: string
    value: string
    contains(textToSearch: string): boolean
  }

  interface KnownActions<T> {
    click(this: T): ActionResult<T>
    focus(this: T): ActionResult<T>
    blur(this: T): ActionResult<T>
    focus(this: T): ActionResult<T>
    clickOn(this: T, text: string): ActionResult<T>
    fillIn(this: T, contentOrClue: string, value?: string): ActionResult<T>
  }

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends string|boolean|number|Function ? T[k]
      : T[k] extends Definition ? Component<T[k]>
      : T[k]
  }

  export type Definition = {
    scope: string
    resetScope?: boolean
    [l: string]: any
  } | {}

  export type Component<T = {}> = KnownProps<T> & UnpackedDefinition<T> & {
    [s: string]: any;
  };

  export type ActionResult<T> = KnownActions<T> & UnpackedDefinition<T> & {
    [s: string]: any
  }

  export function attribute(selector?: string, name?: string): string
  export function isVisible(selector?: string): boolean;
  export function text(selector?: string): string;
  export function value(selector?: string): string;
  export function property(selector?: string, name?: string): string|number|boolean
  export function hasClass(selector: string, className: string): boolean;
  export function hasClass(className?: string): boolean;
  export function contains(): (text: string) => boolean;

  export function clickable(selector?: string): <T>(this: T) => ActionResult<T>
  export function fillable(selector?: string, userOptions?: QueryOptions): <T>(this: T, content: string) => ActionResult<T>
  export function fillable(selector?: string, userOptions?: QueryOptions): <T>(this: T, clue: string, content: string) => ActionResult<T>
  export function triggerable(event: string, selector?: string, eventOptions?: TriggerOptions): <T>(this: T) => ActionResult<T>
  export function focusable(selector?: string): <T>(this: T) => ActionResult<T>
  export function blurrable(selector?: string): <T>(this: T) => ActionResult<T>
  export function visitable(path: string): <T>(this: T, dynamicSegmentsAndQueryParams?: {}) => ActionResult<T>;

  export function collection<T extends Partial<Definition>>(selector: string, definition?: T): Component<T>[];
  export function create<T extends Partial<Definition>>(definition: T): Component<T>
}

declare module 'ember-cli-page-object/extend' {
  export function findElement(pageObject: any, selector?: string, options?: QueryOptions): any //JQuery
  export function findElementWithAssert(pageObject: any, selector?: string, options?: QueryOptions): any // JQuery
}

declare module 'ember-cli-page-object/macros' {
  export function getter<T>(body: (...args: any[]) => T): T
  export function alias(path: string): any
}
