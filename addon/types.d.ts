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

  function create<T extends Partial<Definition>>(definition?: T): Component<T>;
  function collection<T extends Partial<Definition>>(scope: string, definition?: T): Collection<T>;

  // Attributes
  function attribute(attributeName: string, scope?: string, options?: FindOptions): GetterDescriptor<string>;
  function isVisible(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  function isHidden(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  function isPresent(scope?: string, options?: FindOptions): GetterDescriptor<boolean>;
  function text(scope?: string, options?: FindOptions & { normalize?: boolean }): GetterDescriptor<string>;
  function value(scope?: string, options?: FindOptions): GetterDescriptor<string>;
  function property(name: string): GetterDescriptor<any>;
  function property(scope: string, name: string, options?: FindOptions): GetterDescriptor<any>;
  function hasClass(className: string): GetterDescriptor<boolean>;
  function hasClass(scope: string, className: string, options?: FindOptions): GetterDescriptor<boolean>;
  function notHasClass(className: string): GetterDescriptor<boolean>;
  function notHasClass(scope: string, className: string, options?: FindOptions): GetterDescriptor<boolean>;
  function contains(scope?: string, options?: FindOptions): (text: string) => GetterDescriptor<boolean>;
  function count(scope?: string, options?: FindOptions): () => GetterDescriptor<boolean>;

  // Actions
  function clickable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  function clickOnText(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, text: string) => T>;
  function fillable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, clueOrContent: string, content?: string) => T>;
  function selectable(scope?: string, userOptions?: FindOptions): MethodDescriptor<<T>(this: T, clueOrContent: string, content?: string) => T>;
  function triggerable(event: string, scope?: string, eventOptions?: TriggerOptions, options?: FindOptions): MethodDescriptor<<T>(this: T, options?: {}) => T>;
  function focusable(scope?: string, options?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  function blurrable(scope?: string, options?: FindOptions): MethodDescriptor<<T>(this: T) => T>;
  function visitable(path: string): MethodDescriptor<<T>(this: T, dynamicSegmentsAndQueryParams?: {}) => T>;

  interface Collection<T> {
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
}

declare module 'ember-cli-page-object/extend' {
  import 'jquery';
  import { Component, FindOptions, FindOneOptions } from 'ember-cli-page-object/-private';

  function findElement(pageObject: Component, scope?: string, options?: FindOptions): JQuery;
  function findElementWithAssert(pageObject: Component, scope?: string, options?: FindOptions): JQuery;

  function findOne(pageObject: Component, scope?: string, options?: FindOneOptions): Element;
  function findMany(pageObject: Component, scope?: string, options?: FindOptions): Element[];
}

declare module 'ember-cli-page-object/macros' {
  import { GetterDescriptor } from 'ember-cli-page-object/-private';

  function getter<T>(body: (key: string) => T): GetterDescriptor<T>;
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
  import 'jquery';

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

  interface FindOptions extends FindOneOptions {
    multiple?: boolean;
  }

  interface FindOneOptions extends DomElementQueryOptions {
    contains?: string;
    scope?: string;
    last?: boolean;
    visible?: boolean;
    at?: number;
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
}
