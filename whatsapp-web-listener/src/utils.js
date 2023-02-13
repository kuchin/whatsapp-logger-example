const pino = require('pino')()

function getEnv (name) {
  const env = process.env[name]
  if (!env) {
    throw new Error(`Environment variable ${name} is not defined`)
  }
  return env
}

function getEnvOrDefault (name, defaultValue) {
  const env = process.env[name]
  if (!env) {
    return defaultValue
  }
  return env
}

/**
 * pollQueue
 *
 * @desc A function to poll messages from an SQS queue and execute events based on the message body.
 *
 * @param {string} queueUrl - The URL of the SQS queue to poll
 * @param {Object} sqsClient - The SQS client to use for making requests
 * @param {WhatsAppEventHandler} eventsExecuter - The object responsible for executing events based on the message body
 *
 *
 * @returns {void}
 */
const pollQueue = async (queueUrl, sqsClient, eventsExecuter) => {
  pino.info('Polling queue...')
  try {
    const receiveMessageResponse = await sqsClient
      .receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20
      })
      .promise()

    if (receiveMessageResponse.Messages) {
      receiveMessageResponse.Messages.forEach(async (message) => {
        pino.info(`Received message: ${message.Body}`)
        const body = JSON.parse(message.Body)
        eventsExecuter.handle(body)
        await sqsClient
          .deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle
          })
          .promise()
      })
    }
  } catch (err) {
    pino.error(`Unable to pull messages from queue. ERR - ${err.message}`)
  }
  const intervalId = setTimeout(async () => {
    await pollQueue(queueUrl, sqsClient, eventsExecuter)
  }, 2000)
  return intervalId
}

module.exports = {
  getEnv,
  getEnvOrDefault,
  pollQueue
}
