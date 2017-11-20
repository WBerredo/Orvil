console.log('Loading function');

const OFFERS_QTD = 5;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const START_PAYLOAD = 'start';

const MessageSender = require('./lib/MessageSender');
const lomadee = require('./lib/LomadeeHandler');
const dynamoDB = require('./lib/DynamoDBHandler');

const Offer = require('./model/Offer');
const Message = require('./model/Message');
const User = require('./model/User');

function verifyToken(parameters, callback) {
  const serverToken = parameters['hub.verify_token'];
  const response = {
    body: null,
    statusCode: null,
  };

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

function errorEvent(error) {
  console.warn(error);
}

function processMessages(evt, callback) {
  const data = JSON.parse(evt.body);

  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((msg) => {
        if (msg.message) {
          const senderId = msg.sender.id;
          const messageText = msg.message.text;

          if (msg.message.quick_reply &&
            msg.message.quick_reply.payload ===
            MessageSender.SUBSCRIBE_YES_PAYLOAD) {
            const user = new User(senderId, true);
            dynamoDB.upsertUser(user);

            MessageSender.sendTextMessage(senderId, Message.SUBSCRIBE_YES);
            console.log(`User ${senderId} has subscribed`);
            return;
          } else if (msg.message.quick_reply &&
            msg.message.quick_reply.payload ===
            MessageSender.SUBSCRIBE_NO_PAYLOAD) {
            const user = new User(senderId, false);
            dynamoDB.upsertUser(user);

            MessageSender.sendTextMessage(senderId, Message.SUBSCRIBE_NO);
            console.log(`User ${senderId} has subscribed`);
            return;
          }

          lomadee.searchByKeyword(messageText)
            .then((response) => {
              const searchData = response.data;

              console.log(`Lomadee search by ${messageText}`, searchData);
              if (!Array.isArray(searchData.offers)) {
                console.log('Searched data is not an array');
                return;
              }

              const offers = searchData.offers
                .filter(Offer.filterByEbit)
                .sort(Offer.sortByBestPrice)
                .slice(0, OFFERS_QTD)
                .map(Offer.formatOffer);

              const preMessage = Message.SEARCH_RESULTS + Message.SEARCH_POS;
              MessageSender.sendTextMessage(senderId, preMessage)
                .catch(errorEvent);
              MessageSender.sendOfferTemplateMessage(senderId, offers)
                .catch(errorEvent);
            })
            .catch((error) => {
              const preMessage = Message.SEARCH_NO_RESULTS + Message.SEARCH_POS;
              MessageSender.sendTextMessage(senderId, preMessage)
                .catch(errorEvent);
              console.warn(`Error at Lomadee search by ${messageText}`, error);
            });
        } else if (msg.postback && msg.postback.payload) {
          const payload = msg.postback.payload;
          if (payload === START_PAYLOAD) {
            const id = msg.sender.id;
            console.log('Start payload: ', id);

            MessageSender.sendTextMessage(id, Message.WELCOME)
              .then(() => {
                MessageSender.sendSubscribeMessage(
                  id,
                  Message.SUBSCRIBE_QUESTION
                ).catch(errorEvent);
              })
              .catch(errorEvent);
          } else {
            console.warn('Webhook received unhandled payload', payload);
          }
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
