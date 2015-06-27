'use strict';

var test = require('tape');
var toHandlebars = require('../');
var fs = require('fs');
var jade = require('jade');
var handlebars = require('handlebars');

[
  'empty'
].forEach(function (name) {
  test(name, function (t) {
    var locals = require('./locals/' + name + '.json');
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
