#!/usr/bin/env node

const program   = require('commander')
const package   = require('../package.json')
const challenge = require('../lib/challenge')

program
  .version(package.version)
  .parse(process.argv)

challenge.fetch(['hello-world', 'hello-world'])
  .then(challenges => {
    console.log('challenges downloaded:', challenges)
  })
  .catch(error => {
    console.log('something went wrong:', error)
  })
