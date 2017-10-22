# Orvil
Messenger chatbot for books search and recommendation.

## Installation

Go talk to [Orvil](http://m.me/orvil.bot) on Messenger.

### Deploy your own chatbot
* Create a Facebook Page. [See how](https://www.facebook.com/pages/create/).

* Create a Facebook App. [See how](https://developers.facebook.com/docs/apps/register#create-app).

* Host this project in a place you can access file processMessage.js by a endpoint. Orvil is mainly hosted in [AWS Lambda](aws.amazon.com/Lambda/Serverless).

* Setup a webhook with the endpoint that you have created. [See how](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup).

* Create a [Lomadee account](https://www.lomadee.com/). Lomadee is the Orvil book information provider.

* Setup all the needed environment variables with Facebook and Lomadee informations.
  * PAGE_ACCESS_TOKEN
  * APP_SECRET
  * VERIFY_TOKEN

  * LOMADEE_HOST
  * LOMADEE_SOURCE_ID
  * LOMADEE_APP_TOKEN

PS: If you want the send promos feature, you have to host the sendPromos.js file too, and make sure the file will run in the right time. Orvil uses a cron job to run this script every friday.

## Usage

Go talk to [Orvil](http://m.me/orvil.bot) on Messenger or send a message to your own page.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[GNU GENERAL PUBLIC LICENSE (GPL-3.0)](LICENSE)