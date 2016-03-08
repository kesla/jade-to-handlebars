'use strict';

var serializeAttrs = require('./serialize-attrs');
var selfClosing = require('void-elements');
var prevNext = require('./prev-next');

module.exports = walk;

function walk (opts, obj) {
  if (obj.type === 'Block') {
    prevNext(obj.nodes);
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

  if (obj.type === 'Extends') {
    return '<!-- TODO: Fix unsupported jade extends -->\n' +
      'extends ' + obj.file.path + '\n';
  }

  if (obj.type === 'Code') {
    return code(opts, obj);
  }

  if (obj.type === 'Mixin') {
    return mixin(opts, obj);
  }

  if (obj.type === 'Each') {
    return '{{#each ' + obj.obj + ' as |' + obj.val + '|}}' +
      body(opts, obj) +
      '{{/each}}';
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
      (opts && opts.filename ? ' in ' + opts.filename : '')
  );
}

function tag (opts, obj) {
  var attrs = serializeAttrs(obj);

  if (selfClosing[obj.name]) {
    return '<' + (obj.name + ' ' + attrs).trim() + '>';
  }

  return '<' + (obj.name + ' ' + attrs).trim() + '>' +
    body(opts, obj) +
    '</' + obj.name + '>';
}

function code (opts, obj) {
  var match;

  if ((match = obj.val.match(/^if\s+\(?\s+\(?\s*(\w[^\)\n]+)\s*\)?\s*\)?$/i))) {
    var result = '{{#if ' + match[1] + '}}' + '\n' + body(opts, obj);
    if (!obj.next || obj.next.val !== 'else') {
      result = result + '{{/if}}';
    }

    return result;
  }

  if (obj.val === 'else') {
    return '{{else}}' + '\n' + body(opts, obj) + '{{/if}}';
  }

  return '{{' + obj.val + '}}';
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
