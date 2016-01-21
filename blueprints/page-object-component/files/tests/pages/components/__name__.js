import PageObject from '<%= pageObjectsRoot %>';

let {
  text
} = PageObject;

export default {
  title: text('h1')
};
