import PageObject from '<%= pageObjectsRoot %>';

let {
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/')
});
