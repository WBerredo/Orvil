const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const host = 'https://graph.facebook.com';
const path = `/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
const axios = require('axios');

class MessageSender {
  static sendTextMessage(recipientId, messageText) {
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
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
