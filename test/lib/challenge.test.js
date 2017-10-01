const chai      = require('chai')
const sinon     = require('sinon')
const challenge = require('../../lib/challenge')
const registry  = require('../../lib/registry')
const fs        = require('../../lib/fs-as-promise')

chai.use(require('chai-as-promised'))
const expect = chai.expect

describe('lib/challenge', function () {

  it('is an object', () => expect(challenge).to.be.an('object'))

  describe('fetch()', function () {

    beforeEach(() => {
      sinon.stub(fs, 'readFile')
        .returns(Promise.resolve(JSON.stringify({
          challenges: {
            'hello-world': {}
          }
        })))
      sinon.stub(registry, 'get')
        .returns(Promise.resolve({
          challenges: {
            'hello-world': {}
          }
        }))
    })
    afterEach(() => {
      fs.readFile.restore()
      registry.get.restore()
    })

    it('is a function', () => expect(challenge.fetch).to.be.a('function'))

    it('accepts an array as argument', () => {
      return Promise.all([
        expect(challenge.fetch()).to.be.fulfilled,
        expect(challenge.fetch(['hello-world'])).to.be.fulfilled
      ])
    })

    it('rejects when passed argument other than array', () => {
      return Promise.all(['foo', true, 123, null, [], {}].map(value => {
        expect(challenge.fetch(value)).to.be.rejected
      }))
    })

    it('returns a promise', function () {
      const promises = []

      expect((() => {
        promises.push(challenge.fetch())
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      expect((() => {
        promises.push(challenge.fetch(['hello-world']))
        return promises.slice(-1)[0]
      })()).to.be.a('promise')

      return Promise.all(promises)
    })

  })

})
