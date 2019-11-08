import { create, clickable, collection } from "ember-cli-page-object";

const a = create({
  items: collection('.test', {
    testAction: clickable(),

    nestedItems: collection('', {
      prop: 1
    })
  })
});

a.items.length; // $ExpectType number
a.items[0].click().nestedItems[0].prop; // $ExpectType number
a.items[0].testAction().nestedItems[0].prop; // $ExpectType number

const b = create({
  items: collection('.test', {
    a: 1
  })
});

b.items.objectAt(1); // $ExpectType Component<{ a: number; }> | undefined
b.items.toArray(); // $ExpectType Component<{ a: number; }>[]
b.items.map((i) => i.a); // $ExpectType number[]
b.items.filter((i) => true); // $ExpectType Component<{ a: number; }>[]
b.items.mapBy('a'); // $ExpectType any[]
b.items.mapBy('text'); // $ExpectType any[]
b.items.filterBy('a'); // $ExpectType Component<{ a: number; }>[]
b.items.filterBy('value'); // $ExpectType Component<{ a: number; }>[]
b.items.filterBy('value', ''); // $ExpectType Component<{ a: number; }>[]
b.items.findOne((a) => a.a === 1); // $ExpectType Component<{ a: number; }>
b.items.findOneBy('value', 1); // $ExpectType Component<{ a: number; }>
b.items.forEach((node, _i: number) => {
  node.a; // $ExpectType number
});

b.items.mapBy('undeclared'); // $ExpectError
b.items.filterBy('undeclared'); // $ExpectError
b.items.findOneBy('undeclared', 1); // $ExpectError

const [ i1 ] = b.items;
i1.a; // $ExpectType number
