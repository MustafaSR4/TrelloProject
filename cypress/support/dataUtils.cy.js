import { APIKey, APIToken } from "./Constants.cy"

class dataUtils {
  constructor() {
    this.apiBaseUrl = "https://api.trello.com/1"
    this.key = APIKey
    this.token = APIToken
  }

  createBoard(boardName) {
    return cy.request({
      method: "POST",
      url: `${this.apiBaseUrl}/boards`,
      qs: {
        name: boardName,
        defaultLists: false,
        key: this.key,
        token: this.token,
      },
    })
  }

  createList(boardId, listName) {
    return cy.request({
      method: "POST",
      url: `${this.apiBaseUrl}/lists`,
      qs: {
        name: listName,
        idBoard: boardId,
        key: this.key,
        token: this.token,
      },
    })
  }

  createCard(listId, cardName) {
    return cy.request({
      method: "POST",
      url: `${this.apiBaseUrl}/cards`,
      qs: {
        idList: listId,
        name: cardName,
        key: this.key,
        token: this.token,
      },
    })
  }

  createTemplateCard(listId, cardName) {
    return cy.request({
      method: "POST",
      url: `${this.apiBaseUrl}/cards`,
      qs: {
        idList: listId,
        name: cardName,
        isTemplate: true,
        key: this.key,
        token: this.token,
      },
    })
  }

  updateCardName(cardId, newName) {
    return cy.request({
      method: "PUT",
      url: `${this.apiBaseUrl}/cards/${cardId}`,
      qs: {
        name: newName,
        key: this.key,
        token: this.token,
      },
    })
  }

  getCard(cardId) {
    return cy.request({
      method: "GET",
      url: `${this.apiBaseUrl}/cards/${cardId}`,
      qs: {
        key: this.key,
        token: this.token,
      },
    })
  }

  getCardsOnList(listId) {
    return cy.request({
      method: "GET",
      url: `${this.apiBaseUrl}/lists/${listId}/cards`,
      qs: {
        fields: "name,isTemplate,cardRole",
        key: this.key,
        token: this.token,
      },
    })
  }

  deleteBoard(boardId) {
    return cy.request({
      method: "DELETE",
      url: `${this.apiBaseUrl}/boards/${boardId}`,
      qs: {
        key: this.key,
        token: this.token,
      },
    })
  }
}

export default dataUtils