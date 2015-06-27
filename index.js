'use strict';

var lex = require('jade-lexer');
var parse = require('jade-parser');
var selfClosing = require('void-elements');

module.exports = function (input) {
  var ast = parse(lex(input));

  return walk(ast);
};

function walk (obj) {
  if (obj.type === 'Block') {
    return obj.nodes.map(walk).join('');
  }

  if (obj.type === 'Tag') {
    return tag(obj);
  }
}

function tag (obj) {
  var attrs = normalizeAttrs(obj).map(function (attr) {
    return attr.name + '=' + attr.val.replace(/\'/g, '"');
  }).join(' ');

  if (selfClosing[obj.name]) {
    return '<' + (obj.name + ' ' + attrs).trim() + '/>';
  }

  return '<' + (obj.name + ' ' + attrs).trim() + '>' +
    walk(obj.block) +
    '</' + obj.name + '>';
}

function normalizeAttrs (obj) {
  var klass;
  var id;
  var attrs = obj.attrs.filter(function (attr) {
    if (attr.name === 'id') {
      id = attr;
      return false;
    }
    if (attr.name === 'class') {
      klass = attr;
      return false;
    }
    return true;
  });

  if (id) {
    attrs.unshift(id);
  }

  if (klass) {
    attrs.push(klass);
  }
  return attrs;
}
