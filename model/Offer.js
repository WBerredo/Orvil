const BUTTON_TITLE = 'Comprar';

class Offer {
  constructor(name, price, image, link, buttonTitle = BUTTON_TITLE) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.link = link;
    this.buttonTitle = buttonTitle;
  }

  static formatOffer(item) {
    // remove everything inside parentheses and insert Store name
    const name = item.product.name || item.name;
    let formattedName = name.replace(/\s*\(.*?\)\s*/g, '');
    if (item.store && item.store.name) {
      formattedName = `(${item.store.name}) ${formattedName}`;
    }

    let thumbnail = item.thumbnail;
    if (item.product.thumbnail && item.product.thumbnail.url) {
      thumbnail = item.product.thumbnail.url;
    }

    const price = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
    const link = item.link;

    return new Offer(formattedName, price, thumbnail, link);
  }
}

module.exports = Offer;
