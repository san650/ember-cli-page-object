import PageObject from '../../page-object';

let {
  text
} = PageObject;

export default PageObject.component({
  title: text('h1')
});
