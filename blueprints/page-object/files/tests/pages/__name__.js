import {
  create,
  visitable
} from '<%= pageObjectsRoot %>';

export default create({
  visit: visitable('/')
});
