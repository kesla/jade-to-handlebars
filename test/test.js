'use strict';

var test = require('tape');
var toHandlebars = require('../');
var fs = require('fs');
var jade = require('jade');
var handlebars = require('handlebars');
var path = require('path');

fs.readdirSync(__dirname + '/templates')
  .map(function (filename) {
    return path.basename(filename, '.jade');
  })
  .forEach(function (name) {
    test(name, function (t) {
      var locals;
      try {
        locals = require('./locals/' + name + '.json');
      } catch (e) {}
      t.equal(runInHandlebars(name, locals), runInJade(name, locals));
      t.end();
    });
  });

function runInHandlebars (name, locals) {
  var input = fs.readFileSync(__dirname + '/templates/' + name + '.jade', 'utf8');
  return handlebars.compile(toHandlebars(input))(locals);
}

function runInJade (name, locals) {
  return jade.renderFile(__dirname + '/templates/' + name + '.jade', locals);
}
