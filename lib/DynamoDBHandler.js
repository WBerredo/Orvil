const aws = require('aws-sdk');
const User = require('../model/User');

const dynamodb = new aws.DynamoDB();
const USER_TABLE_NAME = 'User';

class DynamoDBHandler {
  static dynamoAttribute(attr) {
    const obj = {};

    switch (typeof attr) {
    case 'number':
      obj.N = attr;
      break;

    case 'boolean':
      obj.BOOL = attr;
      break;

    case 'string':
    default:
      obj.S = attr;
    }

    return obj;
  }

  static upsertUser(user) {
    if (user instanceof User) {
      const dynamoUser = {
        fbId: this.dynamoAttribute(user.fbId),
        subscribe: this.dynamoAttribute(user.subscribe),
      };

      const params = {
        TableName: USER_TABLE_NAME,
        Item: dynamoUser,
      };

      dynamodb.putItem(params, (err, data) => {
        if (err) {
          console.warn("The user couldn't be added", err);
        } else {
          console.log('The user was added', data);
        }
      });
    } else {
      console.warn("You need a instanceof User to use 'upsertUser' method.");
    }
  }
}

module.exports = DynamoDBHandler;
