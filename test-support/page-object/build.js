function Component() {
}

export function build(definition) {
  let component = new Component(),
      keys = Object.keys(definition);

  keys.forEach(function(key) {
    let attr = definition[key];

    component[key] = (attr.buildPageObjectAttribute) ? attr.buildPageObjectAttribute(key, component) : attr;
  });

  return component;
}
