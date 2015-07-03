#!/usr/bin/env node

var toHandlebars = require('../');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

glob.sync('**/*.jade').forEach(function (jadeFilename) {
  var handlebarsName = jadeFilename.slice(0, -4) + 'hbs';
  var file = fs.readFileSync(jadeFilename, 'utf8');
  fs.writeFile(handlebarsName, toHandlebars(file));
});
