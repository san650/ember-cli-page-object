import PO from '../../page-object';

var isDisabled = PO.customHelper(function(selector) {
  return $(selector).prop('disabled');
});

export default {
  select: PO.selectable(),
  selected: PO.text(`option:selected`),
  isDisabled: isDisabled()
};
