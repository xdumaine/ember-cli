'use strict';

var MockUI        = require('./mock-ui');
var MockAnalytics = require('./mock-analytics');
var Cli           = require('../../lib/cli');
var path          = require('path');

module.exports = function ember(args, options) {
  var cli;
  var disableDependencyChecker = options && options.disableDependencyChecker || true;
  var ui = options && options.UI || MockUI;
  var pkg = options && options.package || path.resolve(__dirname, '..', '..');
  args.push('--disable-analytics');
  args.push('--watcher=node');
  args.push('--skipGit');
  cli = new Cli({
    inputStream:  [],
    outputStream: [],
    cliArgs:      args,
    Leek: MockAnalytics,
    UI: ui,
    testing: true,
    disableDependencyChecker: disableDependencyChecker,
    cli: {
      // This prevents ember-cli from detecting any other package.json files
      // forcing ember-cli to act as the globally installed package
      npmPackage: 'ember-cli',
      root: pkg 
    }
  });

  return cli;
};
