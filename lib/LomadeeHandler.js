const appToken = process.env.LOMADEE_APP_TOKEN;
const sourceId = process.env.LOMADEE_SOURCE_ID;
const host = process.env.LOMADEE_HOST;
const categoryId = 3482; // book category
const defaultSize = 5;
const defaultPage = 0;
const path = `/${appToken}/offer/_search`;

const axios = require('axios');

class LomadeeHandler {
  static searchByKeyword(keyword, page = defaultPage, size = defaultSize) {
    return axios({
      url: host + path,
      method: 'GET',
      params: {
        categoryId,
        sourceId,
        keyword,
        page,
        size,
      },
    });
  }
}

module.exports = LomadeeHandler;
