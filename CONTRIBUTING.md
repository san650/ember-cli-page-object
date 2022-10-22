# How To Contribute

This repo is divided into multiple packages using npm workspaces:

- `addon` is the actual ember-cli-page-object addon
- `test-app` is its test suite
- `docs` is the documentation/marketing site

## Installation

- `git clone https://github.com/san650/ember-cli-page-object.git`
- `cd ember-cli-page-object`
- `pnpm install`

## Linting

- `pnpm lint`
- `pnpm lint:fix`

## Running tests

- `pnpm test` – Runs the test suite on the current Ember version
- `pnpm test --server` – Runs the test suite in "watch mode"
- `cd test-app && ember try:each` – Runs the test suite against multiple Ember versions

## Running the test application

- `pnpm start`
- Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
