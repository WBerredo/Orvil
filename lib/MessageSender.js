const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const subscribeYes = 'SUBSCRIBE_YES';
const subscribeNo = 'SUBSCRIBE_NO';
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

  static sendOfferTemplateMessage(recipientId, offers) {
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

  static sendSubscribeMessage(recipientId, message) {
    let messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: message,
        quick_replies: [
          {
            content_type: 'text',
            title: 'Sim',
            payload: this.SUBSCRIBE_YES_PAYLOAD,
          },
          {
            content_type: 'text',
            title: 'Não',
            payload: this.SUBSCRIBE_NO_PAYLOAD,
          },
        ],
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

  static get SUBSCRIBE_YES_PAYLOAD() {
    return subscribeYes;
  }

  static get SUBSCRIBE_NO_PAYLOAD() {
    return subscribeNo;
  }
}

module.exports = MessageSender;
