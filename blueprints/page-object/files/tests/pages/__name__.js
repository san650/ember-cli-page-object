import PageObject from '../page-object';

let {
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/')
});
