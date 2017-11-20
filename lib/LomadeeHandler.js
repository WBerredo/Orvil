const appToken = process.env.LOMADEE_APP_TOKEN;
const sourceId = process.env.LOMADEE_SOURCE_ID;
const host = process.env.LOMADEE_HOST;
const categoryId = 3482; // book category
const defaultSize = 30;
const defaultPage = 0;

const axios = require('axios');

class LomadeeHandler {
  static searchByKeyword(keyword, page = defaultPage, size = defaultSize) {
    const path = `/${appToken}/offer/_search`;

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

  static searchBestSellers(page = defaultPage, size = defaultSize) {
    const path = `/${appToken}/offer/_category/${categoryId}`;

    return axios({
      url: host + path,
      method: 'GET',
      params: {
        sourceId,
        page,
        size,
      },
    });
  }
}

module.exports = LomadeeHandler;
