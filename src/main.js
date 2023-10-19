const core = require('@actions/core')
const { ConsoleResults } = require('./console-results')
const { NotifyClassroom } = require('./notify-classroom')

try {
  const runnerResults = core
    .getInput('runners')
    .split(',')
    .map((runner) => {
      const encodedResults = process.env[`${runner.toUpperCase()}_RESULTS`]
      const json = Buffer.from(encodedResults, 'base64').toString('utf-8')
      return { runner, results: JSON.parse(json) }
    })

  ConsoleResults(runnerResults)
  NotifyClassroom(runnerResults)

  if (runnerResults.any((r) => r.results.status === 'failed')) {
    core.setFailed('Some tests failed.')
  }
} catch (error) {
  core.setFailed(error.message)
}