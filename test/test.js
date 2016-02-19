'use strict';

var test = require('tape');
var toHandlebars = require('../');
var fs = require('fs');
var jade = require('jade');
var handlebars = require('handlebars');
var path = require('path');
var beautify = require('js-beautify').html;

fs.readdirSync(__dirname + '/templates')
  .filter(function (filename) {
    return path.extname(filename) === '.jade';
  })
  .map(function (filename) {
    return path.basename(filename, '.jade');
  })
  .forEach(function (name) {
    test(name, function (t) {
      var locals = getLocals(name);
      var expected = getExpected(name, locals);
      t.equal(
        beautify(runInHandlebars(name, locals), {indent_size: 2}),
        beautify(expected, { indent_size: 2 })
      );
      t.end();
    });
  });

function getExpected (name, locals) {
  var expectedFile = __dirname + '/expected/' + name + '.hbs';
  return fs.existsSync(expectedFile)
    ? fs.readFileSync(expectedFile, 'utf8').trim() : runInJade(name, locals);
}

function getLocals (name) {
  try {
    return require('./locals/' + name + '.json');
  } catch (e) {}
  return {};
}

function runInHandlebars (name, locals) {
  var input = fs.readFileSync(__dirname + '/templates/' + name + '.jade', 'utf8');
  return handlebars.compile(toHandlebars(input))(locals);
}

function runInJade (name, locals) {
  locals.doctype = 'html';
  return jade.renderFile(__dirname + '/templates/' + name + '.jade', locals);
}
