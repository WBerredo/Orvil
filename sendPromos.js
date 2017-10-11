console.log('Loading function');

const dynamoDB = require('./lib/DynamoDBHandler');
const lomadee = require('./lib/LomadeeHandler');
const MessageSender = require('./lib/MessageSender');

const Message = require('./model/Message');
const Offer = require('./model/Offer');

function errorEvent(error) {
  console.warn("error sending fb messages: ", error.response);
}

exports.handler = (event, context, callback) => {
  dynamoDB.getSubscribers((error, data) => {
    if (error) {
      console.warn('There was an error getting subscribers: ', errro);
    } else {
      lomadee.searchBestSellers()
        .then((response) => {
          const searchData = response.data;
          
          // console.log(`Lomadee searched by bestselles`, searchData);
          const offers = searchData.offers.map(Offer.formatOffer);

          data.Items.forEach((item) => {
            const user = item.attrs;

            MessageSender.sendTextMessage(user.fbId, Message.RECOMMEND)
              .catch(errorEvent);
            MessageSender.sendOfferTemplateMessage(user.fbId, offers)
              .catch(errorEvent);  

            console.log('Recommendations sent to :', user);
          });
        })
        .catch(err => console.warn('Was not possible get bestsellers: ', err));
    }

    callback(error, data);
  });
};