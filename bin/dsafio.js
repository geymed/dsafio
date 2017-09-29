#!/usr/bin/env node

const program = require('commander')
const package = require('../package.json')

program
  .version(package.version)
  .command('config <get|set> [key=value...]', 'get/set user configuration')
  .command('fetch <challenge>', 'fetches a challenge')
  .parse(process.argv)
