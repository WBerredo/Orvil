const vogels = require('vogels');
const Joi = require('joi');

const userTable = process.env.DYNAMO_USER_TABLE;

const UserDynamo = vogels.define('UserDynamo', {
  hashKey: 'fbId',

  schema: {
    fbId: Joi.string(),
    subscribe: Joi.boolean(),
  },

  tableName: userTable,
});

module.exports = UserDynamo;
