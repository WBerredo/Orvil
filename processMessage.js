console.log('Loading function');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const MessageSender = require('./lib/MessageSender');

function verifyToken(parameters, callback) {
  const serverToken = parameters['hub.verify_token'];
  /* eslint-disable */
  let response = {
    body: null,
    statusCode: null,
  };
  /*eslint-enable */

  if (serverToken === VERIFY_TOKEN) {
    const challenge = parseInt(parameters['hub.challenge'], 10);
    [response.body, response.statusCode] = [challenge, 200];
  } else {
    [response.body, response.statusCode] = [
      'Error, wrong validation token',
      400,
    ];
  }

  callback(null, response);
}

function processMessages(evt, callback) {
  const data = JSON.parse(evt.body);

  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((msg) => {
        if (msg.message) {
          const senderID = msg.sender.id;
          const messageText = msg.message.text;

          MessageSender.sendTextMessage(senderID, messageText)
            .catch((e) => {
              console.warn(e);
            });
        } else {
          console.error('Webhook received unknown event: ', evt);
        }
      });
    });
  }

  // Assume all went well
  const response = {
    body: 'ok',
    statusCode: 200,
  };

  callback(null, response);
}

exports.handler = (event, context, callback) => {
  const queryParameters = event.queryStringParameters;

  // GET/POST requests
  if (queryParameters) {
    verifyToken(queryParameters, callback);
  } else {
    processMessages(event, callback);
  }
};
