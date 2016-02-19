#!/usr/bin/env node

var toHandlebars = require('../');
var glob = require('glob');
var fs = require('fs');

glob.sync('**/*.jade').forEach(function (jadeFilename) {
  var handlebarsName = jadeFilename.slice(0, -4) + 'hbs';
  var file = fs.readFileSync(jadeFilename, 'utf8');
  var handlebars = toHandlebars(file, { pretty: true, filename: jadeFilename });

  fs.writeFileSync(handlebarsName, handlebars);
});
