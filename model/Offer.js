const BUTTON_TITLE = 'Comprar';

class Offer {
  constructor(name, price, image, link, buttonTitle = BUTTON_TITLE) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.link = link;
    this.buttonTitle = buttonTitle;
  }
}

module.exports = Offer;
