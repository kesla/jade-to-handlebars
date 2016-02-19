'use strict';

module.exports = function (obj) {
  return obj.attrs
    .filter(function (attr) {
      return attr.name !== 'class' &&
        (typeof attr.val !== 'boolean' || attr.val) &&
        attr.val !== 'false';
    })
    .map(handleAttr)
    .concat(handleClasses(obj.attrs)).join(' ');
};

function handleValue (val) {
  return val.split(/\s*\+\s*/).map(function (part) {
    return isVariable(part)
      ? part.slice(1, -1).replace(/"/g, '&quot;')
      : '{{' + part + '}}';
  }).join('');
}

function handleAttr (attr) {
  if (typeof attr.val === 'boolean' || attr.val === 'true') {
    return attr.name;
  }

  return attr.name + '="' + handleValue(attr.val) + '"';
}

function handleClasses (attrs) {
  var classes =
    attrs.filter(function (attr) {
      return attr.name === 'class';
    })
    .map(function (attr) {
      return handleValue(attr.val);
    })
    .join(' ');

  return classes.length > 0 ? 'class="' + classes + '"' : [];
}

function isVariable (part) {
  return /^'.+'$/.test(part) || /^".+"$/.test(part);
}
