const dedent = require('dedent-js');

class Message {
  static get WELCOME() {
    return dedent`Olá, eu sou o Orvil, um chatbot que vai te ajudar a encontrar 
      as melhores ofertas de livros online. Você pode pesquisar livros nas 
      lojas mais confiáveis da web simplesmente digitando o nome do livro ou 
      autor e eu farei tudo que puder para ajudar.`
      .replace(new RegExp('\n', 'g'), '');
  }

  static get SUBSCRIBE_QUESTION() {
    return dedent`Além de poder pesquisar qualquer livro, você também gostaria 
      de receber recomendações semanais de ofertas de livros?`
      .replace(new RegExp('\n', 'g'), '');
  }

  static get SEARCH_RESULTS() {
    return 'Consegui encontrar os seguintes resultados para sua pesquisa.';
  }

  static get SEARCH_NO_RESULTS() {
    return 'Infelizmente não consegui encontrar resultados para sua pesquisa.';
  }

  static get SEARCH_POS() {
    return '\nPara pesquisar novamente, informe o nome do livro e/ou autor.';
  }
}

module.exports = Message;
