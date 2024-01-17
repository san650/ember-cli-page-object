// TypeScript Version: 3.3
declare module 'ember-cli-page-object' {
  import {
    Component,
    Definition,
    FindOptions,
    TriggerOptions,
    GetterDescriptor,
    MethodDescriptor,
    DSL
  } from 'ember-cli-page-object/-private';

  export function create<T extends Partial<Definition>>(definition?: T): Component<T>;
  export function collection<T extends Partial<Definition>>(scope: string, definition?: T): Collection<T>;

  // Attributes
  export function attribute(attributeName: string, scope?: string, options?: FindOptions): GetterDescriptor<string>;
  export function isVisible(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  export function isHidden(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  export function isPresent(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  export function text(scope?: string, options?: FindOptions & { normalize?: boolean }): GetterDescriptor<string>;
  export function value<T = string>(scope?: string, options?: FindOptions): GetterDescriptor<T>;
  export function property<T = unknown>(name: string, scope?: string, options?: FindOptions): GetterDescriptor<T>;
  export function hasClass(className: string, scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  export function notHasClass(className: string, scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  export function contains(scope?: string, options?: FindOptions): (text: string) => GetterDescriptor<boolean>;
  export function count(scope?: string, options?: FindOptions): GetterDescriptor<number>;

  // Actions
  export function clickable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  export function clickOnText(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, text: string) => T>;
  export function fillable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, clueOrContent: string, content?: string) => T>;
  export function selectable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, clueOrContent: string, content?: string) => T>;
  export function triggerable(event: string, scope?: string, eventOptions?: TriggerOptions, options?: FindOptions): MethodDescriptor<<T>(this: T, options?: {}) => T>;
  export function focusable(scope?: string, options?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  export function blurrable(scope?: string, options?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  export function visitable(path: string): MethodDescriptor<<T>(this: T, dynamicSegmentsAndQueryParams?: {}) => T>;

  export interface Collection<T> {
    (scope: string, definition?: T): Array<Component<T>>;

    [i: number]: Component<T>;
    [Symbol.iterator](): Iterator<Component<T>>;

    filter(callback: (c: Component<T>) => boolean): Array<Component<T>>;
    filterBy(propName: keyof T | keyof DSL<T>, value?: any): Array<Component<T>>;
    findOne(callback: (c: Component<T>) => boolean): Component<T>;
    findOneBy(propName: keyof T | keyof DSL<T>, value: any): Component<T>;
    forEach(callback: (c: Component<T>, i: number) => void): void;
    map<S>(callback: (c: Component<T>) => S): S[];
    mapBy(propName: keyof T | keyof DSL<T>): any[];
    objectAt(i: number): Component<T>;
    toArray(): Array<Component<T>>;
  }

  const PageObject: {
    create: typeof create,
    attribute: typeof attribute,
    isVisible: typeof isVisible,
    isHidden: typeof isHidden,
    isPresent: typeof isPresent,
    text: typeof text,
    value: typeof value,
    property: typeof property,
    hasClass: typeof hasClass,
    notHasClass: typeof notHasClass,
    contains: typeof contains,
    count: typeof count,
    clickable: typeof clickable,
    clickOnText: typeof clickOnText,
    fillable: typeof fillable,
    selectable: typeof selectable,
    triggerable: typeof triggerable,
    focusable: typeof focusable,
    blurrable: typeof blurrable,
    visitable: typeof visitable,
  }

  export default PageObject;
}

declare module 'ember-cli-page-object/extend' {
  import type * as JQuery from 'jquery';

  import { Component, FindElementOptions, FindOptions } from 'ember-cli-page-object/-private';

  function findElement(pageObject: Component, scope?: string, options?: FindElementOptions): JQuery;
  function findElementWithAssert(pageObject: Component, scope?: string, options?: FindElementOptions): JQuery;

  function findOne(pageObject: Component, scope?: string, options?: FindOptions): Element;
  function findMany(pageObject: Component, scope?: string, options?: FindOptions): Element[];
}

declare module 'ember-cli-page-object/macros' {
  import { Component, GetterDescriptor } from 'ember-cli-page-object/-private';

  function getter<P, T = any>
    (body: (this: Component<P>, key: string) => T)
    : GetterDescriptor<T>;

  function alias(path: string, options?: { chainable: boolean }): any;
}

declare module 'ember-cli-page-object/adapter' {
  export default class Adapter {}
}

declare module 'ember-cli-page-object/adapters/rfc268' {
  import Adapter from 'ember-cli-page-object/adapter';

  export default class RFC268Adapter extends Adapter {}
}

declare module 'ember-cli-page-object/adapters' {
  import Adapter from 'ember-cli-page-object/adapter';

  export function setAdapter(adapter: Adapter): void
}

declare module 'ember-cli-page-object/-private' {
  import type * as JQuery from 'jquery';

  interface GetterDescriptor<T> {
    isGetter: true;

    get: T;
  }

  interface MethodDescriptor<T extends <S>(this: S, ...args: any[]) => S> {
    isMethod: true;

    (...args: Parameters<T>): ReturnType<T>;

    get(): T;
  }

  type Component<T = Definition> = UnpackedDefinition<T> & DSL<T> & {
    [s: string]: unknown;
  };

  type UnpackedDefinition<T> = {
    [k in keyof T]:
      T[k] extends GetterDescriptor<infer C> ? C
      : T[k] extends MethodDescriptor<infer C> ? C
      : T[k] extends Function | Component ? T[k]
      : T[k] extends object ? Component<T[k]>
      : T[k]
  };

  interface DSL<T> {
    isHidden?: boolean;
    isPresent?: boolean;
    isVisible?: boolean;
    text?: string;
    value?: string;
    contains(textToSearch: string): boolean;

    blur(): Component<T>;
    click(): Component<T>;
    clickOn(text: string): Component<T>;
    fillIn(clueOrContent: string, content?: string): Component<T>;
    focus(): Component<T>;

    then(
      onfulfilled?: (value: any) => any,
      onrejected?: (reason: any) => any
    ): Component<T>;
  }

  interface Definition extends SelectorQueryOptions {
    scope?: string;

    [l: string]: unknown;
  }

  interface FindElementOptions extends FindOptions {
    multiple?: boolean;
  }

  interface FindOptions extends DomElementQueryOptions, QueryFilterOptions {
    scope?: string;
  }

  interface TriggerOptions extends FindOptions {
    eventProperties?: object;
  }

  interface DomElementQueryOptions extends SelectorQueryOptions {
    pageObjectKey?: string;
  }

  interface SelectorQueryOptions {
    resetScope?: boolean;
    testContainer?: string|HTMLElement|JQuery;
  }

  interface QueryFilterOptions {
    at?: number;
    contains?: string;
    last?: boolean;
    visible?: boolean;
  }
}
