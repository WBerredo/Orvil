const User = require('../model/User');

const UserDynamo = require('../model/UserDynamo');

class DynamoDBHandler {
  static upsertUser(user) {
    if (user instanceof User) {
      UserDynamo.create(user, (err, savedUser) => {
        if (err) {
          console.warn('Error while saving user: ', err);
        } else {
          console.log('User saved: ', savedUser);
        }
      });
    } else {
      console.warn("You need a instanceof User to use 'upsertUser' method.");
    }
  }

  static getSubscribers(callback) {
    UserDynamo
      .scan()
      .where('subscribe').equals(true)
      .loadAll()
      .exec(callback);
  }
}

module.exports = DynamoDBHandler;
