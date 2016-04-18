#!/usr/bin/env node

'use strict';
const program = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({
  pkg,
}).notify();

program
  .version(pkg.version, '-V --version');

program
  .command('dev')
  .alias('watch')
  .description('开发模式')
  .option('-p, --port [port]', 'The dev-server port')
  .option('-m, --module [module]', 'The dev module')
  .option('-e, --entry [entry]', 'The entry file')
  .option('-t, --template [template]', 'The template html file')
  .action(require('../lib/action/dev'))
  .on('--help', function (){
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('build')
  .alias('dist')
  .description('构建模式')
  .option('-m, --module [module]', 'The dev module')
  .option('-e, --entry [entry]', 'The entry file')
  .option('-t, --template [template]', 'The template html file')
  .action(require('../lib/action/build'));


program
  .command('deploy')
  .alias('prod')
  .description('发布模式')
  .option('-m, --module [module]', 'The dev module')
  .option('-e, --entry [entry]', 'The entry file')
  .option('-t, --template [template]', 'The template html file')
  .action(require('../lib/action/prod'));

program
  .parse(process.argv);
