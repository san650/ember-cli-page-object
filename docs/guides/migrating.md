---
layout: page
title: Migrate from v1.x
---
{% raw %}

In the update to "ember-cli-page-object" v2.x, we've cleaned up the codebase from legacy APIs and added support for modern ember versions(4+). 

Embroider is also supported now!

Some "ember-cli-page-object" own APIs have been removed to simplify internals and unlock the path forward for new features. If you have migration issues related to your tests codebase, please follow the [v1.x deprecation guide](/docs/v1.17.x/deprecations).

We've also completely removed support for the old ember `moduleFor` flavored tests. If you have migrated to the "@ember/test-helpers" already, it's unlikely you will need additional code changes to perform your upgrade to the v2.x of "ember-cli-page-object". If you still have some async unaware page objects usages, you may find useful the [codemod](https://www.npmjs.com/package/ember-page-object-codemod).

Also, in order to support Embroider, we had to upgrade to the "ember-auto-import@^2.0.0", which means any consumer of this library should have "ember-auto-import@^2.0.0" installed. For upgrade instructions, please check "ember-auto-import" [README](https://www.npmjs.com/package/ember-auto-import).

{% endraw %}
