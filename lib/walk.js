'use strict';

var normalizeAttrs = require('./normalize-attrs');
var selfClosing = require('void-elements');

module.exports = walk;

function walk (opts, obj) {
  if (obj.type === 'Block') {
    return obj.nodes.map(walk.bind(null, opts)).join('');
  }

  if (obj.type === 'Tag') {
    return tag(opts, obj);
  }

  if (obj.type === 'Doctype') {
    if (obj.val === 'html') {
      return '<!DOCTYPE html>';
    }

    if (obj.val === 'xml') {
      return '<?xml version="1.0" encoding="utf-8" ?>';
    }

    return '<!-- TODO: Fix unsupported doctype -->\n' +
      'doctype ' + obj.val;
  }

  if (obj.type === 'Text') {
    return text(obj);
  }

  if (obj.type === 'Include') {
    return '<!-- TODO: Fix unsupported jade include -->\n' +
      'include ' + obj.file.path + '\n';
  }

  if (obj.type === 'Code') {
    return '{{' + obj.val + '}}';
  }

  if (obj.type === 'Mixin') {
    return mixin(opts, obj);
  }

  if (obj.type === 'Each') {
    return '{{#each ' + obj.obj + ' as |' + obj.val + '|}}' +
      body(opts, obj) +
      '{{/each}}'
  }

  if (obj.type === 'BlockComment') {
    if (obj.buffer) {
      return '<!--' + body(opts, obj) + '-->';
    }
    return '{{!-- ' + body(opts, obj) + '--}}';
  }

  if (obj.type === 'Comment') {
    if (obj.buffer) {
      return '<!--' + obj.val + '-->';
    }
    return '{{!-- ' + obj.val + '--}}';
  }

  throw new Error(
    'Unsupported node, type ' + obj.type +
      (opts && opts.filename ? ' in ' + opt.filename : '')
  );
}

function tag (opts, obj) {
  var attrs = normalizeAttrs(obj).map(function (attr) {
    var val = attr.escaped ? attr.val : attr.val.replace(/\'/g, '"');

    if (/^'.+'$/.test(val)) {
      val = '"' + val.slice(1, -1) + '"';
    }

    if (!/^".+"$/.test(val)) {
      val = '"{{' + val + '}}"';
    }

    return attr.name + '=' + val;
  }).join(' ');

  if (selfClosing[obj.name]) {
    return '<' + (obj.name + ' ' + attrs).trim() + '/>';
  }


  return '<' + (obj.name + ' ' + attrs).trim() + '>' +
    body(opts, obj) +
    '</' + obj.name + '>';
}

function mixin (opts, obj) {
  return '<!-- TODO: Fix unsupported jade mixin -->\n' +
    'mixin ' + obj.name + '(' + obj.args + ')' + '\n' +
    body(opts, obj);
}

function body (opts, obj) {
  if (obj.code) {
    return walk(opts, obj.code);
  }
  if (obj.block) {
    return walk(opts, obj.block);
  }

  return '';
}

function text (obj) {
  var result = obj.val.replace(/#{([^}]+)}/g, '{{$1}}');

  if (/\!\{.+\}/.test(obj.val)) {
    result = '<!-- TODO: Fix unsupported jade inline javascript -->\n' + result;
  }

  return result;
}
