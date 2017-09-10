const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const host = 'https://graph.facebook.com';
const path = `/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
const Offer = require('../model/Offer');
const axios = require('axios');

class MessageSender {
  static sendTextMessage(recipientId, messageText) {
    let messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    };

    return this.callSendAPI(messageData);
  }

  static sendTemplateMessage(recipientId, offers) {
    let templateElements = [];
    offers.forEach((offer) => {
      if (offer instanceof Offer) {
        templateElements.push({
          title: offer.name,
          subtitle: offer.price,
          image_url: offer.image,
          buttons: [{
            type: 'web_url',
            url: offer.link,
            title: offer.buttonTitle,
          }],
        });
      }
    });

    let messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: templateElements,
          },
        },
      },
    };

    return this.callSendAPI(messageData);
  }

  static callSendAPI(messageData) {
    return axios({
      url: host + path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: messageData,
    });
  }
}

module.exports = MessageSender;
