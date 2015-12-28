import PageObject from '<%= testFolderRoot %>/page-object';

let {
  visitable
} = PageObject;

export default PageObject.create({
  visit: visitable('/')
});
