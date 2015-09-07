'use strict';

module.exports = function normalizeAttrs (obj) {
  var classes = [];
  var id;
  var attrs = obj.attrs.filter(function (attr) {
    if (attr.name === 'id') {
      id = attr;
      return false;
    }
    if (attr.name === 'class') {
      classes.push(attr);
      return false;
    }
    return true;
  });

  if (id) {
    attrs.unshift(id);
  }

  if (classes.length) {
    attrs.push({
      name: 'class',
      val: '"' + classes.map(function (klass) {
        return klass.val.slice(1, -1);
      }).join(' ') + '"',
      escaped: false
    });
  }

  return attrs;
};
