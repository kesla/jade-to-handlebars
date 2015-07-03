'use strict';

var lex = require('jade-lexer');
var parse = require('jade-parser');
var selfClosing = require('void-elements');
var beautify = require('js-beautify').html;

module.exports = function (input, opts) {
  var ast = parse(lex(input));

  var html = walk(ast);

  return (opts && opts.pretty) ? beautify(html, { indent_size: 2 }) : html;
};

function walk (obj) {
  if (obj.type === 'Block') {
    return obj.nodes.map(walk).join('');
  }

  if (obj.type === 'Tag') {
    return tag(obj);
  }

  if (obj.type === 'Text') {
    return text(obj);
  }

  if (obj.type === 'Include') {
    return '<!-- TODO: Fix unsupported jade include -->\n' +
      'include ' + obj.file.path + '\n';
  }
}

function text (obj) {
  var result = obj.val.replace(/#{([^}]+)}/g, '{{$1}}');

  if (/\!\{.+\}/.test(obj.val)) {
    result = '<!-- TODO: Fix unsupported jade inline javascript -->\n' + result;
  }

  return result;
}

function tag (obj) {
  var attrs = normalizeAttrs(obj).map(function (attr) {
    var val = attr.escaped ? attr.val : attr.val.replace(/\'/g, '"');

    if (!/^".+"$/.test(val)) {
      val = '"{{' + val +'}}"';
    }

    return attr.name + '=' + val;
  }).join(' ');

  if (selfClosing[obj.name]) {
    return '<' + (obj.name + ' ' + attrs).trim() + '/>';
  }

  return '<' + (obj.name + ' ' + attrs).trim() + '>' +
    walk(obj.block) +
    '</' + obj.name + '>';
}

function normalizeAttrs (obj) {
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
}
