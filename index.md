---
layout: page
title: Overview
---

This addon makes creating Page Objects for your acceptance test really easy. It tries hard to

* Be declarative
* Propose a convention
* Be extremely easy to extend
* Not to be intrusive
* Not to be tie to a specific testing framework (but be really tie to Ember :D)

## So, What is a Page Object?

Ember, and more specifically `ember-testing`, provide a DSL that simplifies
creation and validation of these conditions on our tests.

One of the problems with acceptance tests is that many of the CSS selectors used
to look up elements were repeated across tests. In some cases, this repetition
seemed like a smell.

Then, in some cases the complexity of selectors used prevented us to easily
identify what we were trying to test. This can become very confusing, concealing
the original purpose for the test.

A widely-used design pattern came to the rescue: Page Objects. The main idea
behind this pattern is to encapsulate the page structure being tested with an
object, hiding the details of its HTML structure and therefore exposing the
semantic structure of the page only.

This addon allows you to define page objects in a declarative fashion making
really simple to model complex pages.
