class Message {
  static get WELCOME() {
    return 'Olá, eu sou o Orvil';
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
