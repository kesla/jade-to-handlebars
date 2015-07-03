'use strict';

var test = require('tape');
var toHandlebars = require('../');
var fs = require('fs');
var jade = require('jade');
var handlebars = require('handlebars');
var path = require('path');
var beautify = require('js-beautify').html;

fs.readdirSync(__dirname + '/templates')
  .map(function (filename) {
    return path.basename(filename, '.jade');
  })
  .forEach(function (name) {
    test(name + '(pretty = false)', function (t) {
      var locals;
      try {
        locals = require('./locals/' + name + '.json');
      } catch (e) {}
      t.equal(runInHandlebars(name, locals), runInJade(name, locals));
      t.end();
    });

    test(name + '(pretty = true)', function (t) {
      var locals = {};
      try {
        locals = require('./locals/' + name + '.json');
      } catch (e) {}
      t.equal(
        runInHandlebars(name, locals, { pretty: true}),
        beautify(runInJade(name, locals), { indent_size: 2 })
      );
      t.end();
    });
  });

function runInHandlebars (name, locals, opts) {
  var input = fs.readFileSync(__dirname + '/templates/' + name + '.jade', 'utf8');
  return handlebars.compile(toHandlebars(input, opts))(locals);
}

function runInJade (name, locals) {
  return jade.renderFile(__dirname + '/templates/' + name + '.jade', locals);
}
