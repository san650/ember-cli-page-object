import { create } from './create';

/**
 * Sets up a reference to `this.page` with the correct context set
 */
export default function(hooks, pageDefinition) {
  hooks.beforeEach(function() {
    this.page = create(pageDefinition);
    this.page.setContext(this);
  });
}