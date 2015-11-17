'use strict';

var MockUI        = require('./mock-ui');
var MockAnalytics = require('./mock-analytics');
var Cli           = require('../../lib/cli');
var path          = require('path');
var Promise       = require('../../lib/ext/promise');

module.exports = function ember(args, options) {
  var cli;
  var disableDependencyChecker = options && options.disableDependencyChecker || true;
  var pkg = options && options.package || path.resolve(__dirname, '..', '..');
  var inputStream  = [];
  var outputStream = [];
  var errorStream  = [];
  var errorLog     = [];
  args.push('--disable-analytics');
  args.push('--watcher=node');
  args.push('--skipGit');
  cli = new Cli({
    inputStream:  inputStream,
    outputStream: outputStream,
    errorStream:  errorStream,
    errorLog:     errorLog,
    cliArgs:      args,
    Leek: MockAnalytics,
    UI: MockUI,
    testing: true,
    disableDependencyChecker: disableDependencyChecker,
    cli: {
      // This prevents ember-cli from detecting any other package.json files
      // forcing ember-cli to act as the globally installed package
      npmPackage: 'ember-cli',
      root: pkg 
    }
  });
  function returnTestState(statusCode) {
     return {
        statusCode: statusCode,
        inputStream: inputStream,
        outputStream: outputStream,
        errorStream: errorStream,
        errorLog: errorLog
     };
   }

  return cli.then(returnTestState, function(statusCode) {
     return Promise.reject(returnTestState(statusCode));
  });
};
