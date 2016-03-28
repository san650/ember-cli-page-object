import {
  create,
  visitable
} from 'page-object';

export default create({
  visit: visitable('/')
});
