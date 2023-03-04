---
layout: page
title: Migrate from v1.x
---
{% raw %}

In the update to "ember-cli-page-object" v2.x, we've cleaned up the codebase from legacy APIs and added support for modern ember versions(4+). Embroider is also supported now! Some APIs are removed to simplify internals and unlock the path forward for new features. In case of migration issues related to the tests codebase, please follow the [v1.x deprecations guide](/docs/v1.17.x/deprecations).

We've also completely removed support for the old ember `moduleFor` flavored tests. If you have migrated to the "@ember/test-helpers" already, it's unlikely you will need additional code changes, to perform upgrade to the v2.x of "ember-cli-page-object". However, if your codeabse still uses some `async`/`await` unaware page object actions, you may find the [`exlicit-async` codemod](https://www.npmjs.com/package/ember-page-object-codemod) helpful.

To support Embroider, we also had to upgrade to the "ember-auto-import@^2.0.0", which means that any consumer of this library should have "ember-auto-import@^2.0.0" installed. For upgrade instructions, please check "ember-auto-import" [README](https://www.npmjs.com/package/ember-auto-import).

{% endraw %}
