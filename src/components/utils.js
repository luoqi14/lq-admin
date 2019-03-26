/* eslint-disable no-self-compare */
function isEmpty(value) {
  if (value === undefined || value === '' || value !== value || value === null || value === 'NaN') {
    return true;
  }
  return false;
}

module.exports = {
  isEmpty,
};
