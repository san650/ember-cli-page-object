declare module 'require' {
  interface Require {
    (moduleName: string, ...args: unknown[]): unknown;

    has(name: string): boolean;
  }

  const requirejs: Require;

  export default requirejs;
}
