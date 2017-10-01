const os       = require('os')
const request  = require('request-promise-native')
const registry = require('./registry')

const DSAFIO_CHALLENGE_HOME = process.env.DSAFIO_CHALLENGE_HOME || `${os.homedir()}/dsafio`

function fetch (keys) {
  if (keys !== undefined && (!Array.isArray(keys) || !keys.length)) {
    return Promise.reject(new Error('challenge.fetch() accepts an array of challenge keys'))
  }

  return registry.get(['challenges'])
    .then(registry => registry.challenges)
    .then(challenges => {
      if (!keys) {
        return challenges
      }

      return keys.reduce((subset, key) => {
        if (!challenges.hasOwnProperty(key)) {
          throw new Error(`Invalid challenge key '${key}'`)
        }

        return Object.assign(subset, { [key]: challenges[key] })
      }, {})
    })
    .then(challenges => {
      return Promise.all(Object.keys(challenges).map(challenge => {
        return Promise.all([
          'index.js',
          'readme.md',
          'test.js'
        ].map(filename => {
          return request(`https://api.github.com/repos/dsafio/challenges/contents/challenges/${challenge}/${filename}`, {
            headers: { 'User-Agent': 'dsafio/dsafio' }
          })
            .then(JSON.parse)
            .then(file => ({
              name: file.name,
              content: new Buffer(file.content, 'base64').toString('ascii')
            }))
        }))
      }))
    })
}

function fetchChallenge (key) {
  if (!key) {
    return Promise.reject(new Error(`Invalid challenge key '${key}'`))
  }

  return registry.get(['challenges'])
    .then(registry => registry['challenges-files'])
    .then(challenges => {

    })
}

module.exports = { fetch }
