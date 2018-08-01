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

  type aFunc = (...args: any[]) => any

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends string|boolean|number|Function ? T[k]
      : T[k] extends Definition ? Component<T[k]>
      : never
  }

  type Definition = {
    scope?: string
    resetScope?: boolean
  }

  type BoundFunction<T, K extends Function> = (this: T, ...args: any[]) => K
  type ActionInstance<T> = (this: T, ...args: any[]) => ActionResult<T>

  export type Component<T> = KnownProps<T> & UnpackedDefinition<T>;

  export type ActionResult<T> = KnownActions<T> & UnpackedDefinition<T> & {
    [s: string]: any
  }

  export function attribute<T>(selector?: string, name?: string): string
  export function isVisible(selector?: string): Function;
  export function text(selector?: string): Function;
  export function value(selector?: string): Function;
  export function property<T>(selector?: string, name?: string): string
  export function hasClass(selector: string, className: string): Function;
  export function hasClass(className?: string): Function;

  export function clickable<T>(selector?: string): () => ActionResult<T>
  export function fillable<T>(valueOrClue?: string, value?: string): () => ActionResult<T>
  export function triggerable<T>(event: string, selector?: string, eventOptions?: TriggerOptions): () => ActionResult<T>
  export function focusable<T>(selector?: string): () => ActionResult<T>
  export function blurable<T>(selector?: string): () => ActionResult<T>

  export function visit<T>(pageObject?: object): any;
  export function create<T extends Partial<Definition>>(def: T): Component<T>
}

declare module 'ember-cli-page-object/extend' {
  export function findElement(pageObject: object, selector: string, options?: QueryOptions): any //JQuery
  export function findElementWithAssert(pageObject: object, selector: string, options?: QueryOptions): any // JQuery
}

declare module 'ember-cli-page-object/macros' {
  export function getter(body: Function): Function
  export function alias(path: string): object
}
