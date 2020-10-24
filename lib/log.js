/**
 * @module ws/lib/log
 * server logging module using chalk
 */
const chalk = require('chalk')

module.exports = (key = '', msg = '') => {
  console.log(`  ${chalk.white.bold(key)} : ${chalk.cyan(msg)}`)
}

module.exports.error = (key = 'error', msg = '') => {
  console.error(`  ${chalk.black.bgRed.bold(key)} : ${chalk.red(msg)}`)
}

module.exports.debug = (key = '', msg = '') => {
  console.debug(`  ${chalk.grey(key)} : ${chalk.grey(msg)}`)
}
