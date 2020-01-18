declare module 'require' {
  interface Require {
    (moduleName: string, ...args: any[]): any;

    has(name: string): boolean
  }

  const requirejs: Require;

  export default requirejs;
}

