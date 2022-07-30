# How To Contribute

This repo is divided into multiple packages using npm workspaces:

- `addon` is the actual ember-cli-page-object addon
- `test-app` is its test suite
- `docs` is the documentation/marketing site

## Installation

* `git clone https://github.com/san650/ember-cli-page-object.git`
* `cd ember-cli-page-object`
* `npm install`

## Linting

Inside any of the packages you can run:

* `npm run lint`
* `npm run lint:fix`

## Running tests

* `cd addon && npm run start` – Builds the addon in "watch mode" so changes picked up by test app.
* `cd test-app && ember test` – Runs the test suite on the current Ember version
* `cd test-app && ember test --server` – Runs the test suite in "watch mode"
* `cd test-app && ember try:each` – Runs the test suite against multiple Ember versions

During development, if you'd like test app to pick up changes in the addon, make sure to run both
`cd addon && npm run start` and `cd test-app && ember test --server` in different terminals.

## Running the test application

* `cd test-app && ember serve`
* Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
