import resolver from './helpers/legacy-resolver';
import { setResolver } from 'ember-qunit';
import { start } from 'ember-cli-qunit';

setResolver(resolver);

start();
