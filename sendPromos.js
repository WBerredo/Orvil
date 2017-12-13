console.log('Loading function');

const dynamoDB = require('./lib/DynamoDBHandler');
const lomadee = require('./lib/LomadeeHandler');
const MessageSender = require('./lib/MessageSender');

const Message = require('./model/Message');
const Offer = require('./model/Offer');

function errorEvent(error) {
  console.warn("error sending fb messages: ", error.response);
}

function randomSort() {
  return 0.5 - Math.random();
}

exports.handler = (event, context, callback) => {
  const promoTotalSize = 100;
  const promoToSendSize = 5;

  lomadee.searchBestSellers(0, promoTotalSize)
    .then((response) => {
      const searchData = response.data;

      // console.log(`Lomadee searched by bestsellers`, searchData);
      const offers = searchData.offers
        .sort(randomSort)
        .slice(0, promoToSendSize)
        .map(Offer.formatOffer)
        ;

      dynamoDB.getSubscribers((error, data) => {
        if (error) {
          console.warn('There was an error getting subscribers: ', error);
        } else {
          data.Items.forEach((item) => {
            const user = item.attrs;

            MessageSender.sendTextMessage(user.fbId, Message.RECOMMEND)
              .catch(errorEvent);
            MessageSender.sendOfferTemplateMessage(user.fbId, offers)
              .catch(errorEvent);  

            console.log('Recommendations sent to :', user);
          });
        }

        callback(error, data);
      });
    })
    .catch(err => console.warn('Was not possible get bestsellers: ', err)
  );
};