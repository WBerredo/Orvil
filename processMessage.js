console.log('Loading function');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.APP_SECRET;

const START_PAYLOAD = 'start';
const SUBSCRIBE_YES_PAYLOAD = 'SUBSCRIBE_YES';
const SUBSCRIBE_NO_PAYLOAD = 'SUBSCRIBE_NO';

const lomadee = require('./lib/LomadeeHandler');
const Offer = require('./model/Offer');
const Message = require('./model/Message');

const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: ACCESS_TOKEN,
  verifyToken: VERIFY_TOKEN,
  appSecret: APP_SECRET,
});

function promiseErrors(error) {
  // loggin errors
  console.warn(error);
}

function offerTemplateMessage(offers) {
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

  return templateElements;
}

// get started message
bot.on(`postback:${START_PAYLOAD}`, (payload, chat) => {
  chat.say(Message.WELCOME)
    .then(() => {
      chat.sendTextMessage(Message.SUBSCRIBE_QUESTION, [
        {
          content_type: 'text',
          title: Message.YES,
          payload: SUBSCRIBE_YES_PAYLOAD,
        },
        {
          content_type: 'text',
          title: Message.NO,
          payload: SUBSCRIBE_NO_PAYLOAD,
        },
      ]);
    })
    .catch(promiseErrors);
});

bot.on(`quick_reply:${SUBSCRIBE_YES_PAYLOAD}`, (payload, chat) => {
  chat.say(Message.SUBSCRIBE_YES);
});

bot.on(`quick_reply:${SUBSCRIBE_NO_PAYLOAD}`, (payload, chat) => {
  chat.say(Message.SUBSCRIBE_NO);
});

// book search
bot.on('message', (payload, chat) => {
  const text = payload.message.text;

  if (text !== Message.YES && text !== Message.NO) {
    lomadee.searchByKeyword(text)
      .then((response) => {
        let searchData = response.data;

        console.log(`Lomadee search by ${text}`, searchData);
        let offers = searchData.offers
          .map((item) => {
            // remove everything inside parentheses and insert Store name
            let name = item.product.name || item.name;
            let formattedName = name.replace(/\s*\(.*?\)\s*/g, '');
            if (item.store && item.store.name) {
              formattedName = `(${item.store.name}) ${formattedName}`;
            }

            let thumbnail = item.thumbnail;
            if (item.product.thumbnail && item.product.thumbnail.url) {
              thumbnail = item.product.thumbnail.url;
            }

            let price = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
            let link = item.link;

            return new Offer(formattedName, price, thumbnail, link);
          });

        let preMessage = Message.SEARCH_RESULTS + Message.SEARCH_POS;
        chat.say(preMessage);
        chat.sendGenericTemplate(offerTemplateMessage(offers))
          .catch(promiseErrors);
      })
      .catch((error) => {
        chat.say(Message.SEARCH_NO_RESULTS + Message.SEARCH_POS);
        console.warn(`Error at Lomadee search by ${text}`, error);
      });
  }
});

bot.start();
