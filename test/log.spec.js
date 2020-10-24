/* eslint-env jest */
/* eslint-disable no-control-regex, no-useless-escape */
const chalk = require('chalk')
const log = require('../lib/log')

const escapeChalk = (colorized) => colorized
  .replace(/\u001b/g, '\\u001b')
  .replace(/\[/igm, '\\\[')

describe('log', () => {
  beforeAll(() => {
    console.log = jest.fn()
    console.debug = jest.fn()
    console.error = jest.fn()
  })

  it('logs "key : message"', () => {
    log('test', 'message')

    const expected = [
      /test/,
      /message/
    ]

    expected.forEach(regexp => expect(
      console.log.mock.calls[0][0]
    ).toEqual(
      expect.stringMatching(regexp)
    ))
  })

  it('has a debug method that logs "key : message" in grey', () => {
    log.debug('test', 'message')

    const expected = [
      /test/,
      new RegExp(escapeChalk(chalk.gray('message')))
    ]

    expected.forEach(regexp => expect(
      console.debug.mock.calls[0][0]
    ).toEqual(
      expect.stringMatching(regexp)
    ))
  })

  it('has an error method that logs the message in red', () => {
    log.error('test', 'message')

    const expected = [
      /test/,
      new RegExp(escapeChalk(chalk.red('message')))
    ]

    expected.forEach(regexp => expect(
      console.error.mock.calls[0][0]
    ).toEqual(
      expect.stringMatching(regexp)
    ))
  })
})

describe('log module.exports', () => {
  expect(log).toBeDefined()
  expect(log).toHaveProperty('debug')
  expect(log).toHaveProperty('error')
})
