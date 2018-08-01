import "jquery";
import { create } from 'ember-cli-page-object';
import { findElement, findElementWithAssert } from 'ember-cli-page-object/extend';

const node = create({});

findElementWithAssert(); // $ExpectError
findElementWithAssert(null); // $ExpectError
findElementWithAssert({}); // $ExpectError
findElementWithAssert(node, { at: 0 }); // $ExpectError
findElementWithAssert(node, 'scope', { nonExisting: 0 }); // $ExpectError

findElementWithAssert(node); // $ExpectType JQuery<HTMLElement>
findElementWithAssert(node, 'scope'); // $ExpectType JQuery<HTMLElement>
findElementWithAssert(node, 'scope', {
  at: 0,
  last: false,
  pageObjectKey: 'test',
  testContainer: '',
  visible: false
});

findElement(); // $ExpectError
findElement(null); // $ExpectError
findElement({}); // $ExpectError
findElement(node, { at: 0 }); // $ExpectError
findElement(node, 'scope', { nonExisting: 0 }); // $ExpectError

findElement(node); // $ExpectType JQuery<HTMLElement>
findElement(node, 'scope'); // $ExpectType JQuery<HTMLElement>
findElement(node, 'scope', {
  at: 0,
  last: false,
  pageObjectKey: 'test',
  testContainer: document.createElement('div'),
  visible: false
});
