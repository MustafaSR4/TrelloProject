import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import HideTemplateActions from "../../../pageObjects/hideTemplate/Actions.cy";
import HideTemplateAssertions from "../../../pageObjects/hideTemplate/Assertions.cy";
import { APIKey, APIToken } from "../../../support/Constants.cy";

const actions = new HideTemplateActions();
const assertions = new HideTemplateAssertions();

const apiBaseUrl = "https://api.trello.com/1";
const key = APIKey;
const token = APIToken;

let boardId;
let boardUrl;
let listId;
let cardId;

let boardName;
let templateName;

const listName = "Template List";

before(() => {
  expect(key, "Trello API key").to.exist;
  expect(token, "Trello API token").to.exist;

  const uniqueNumber = Date.now();

  boardName = `Hide Template Board ${uniqueNumber}`;
  templateName = `Template Card ${uniqueNumber}`;

  cy.request({
    method: "POST",
    url: `${apiBaseUrl}/boards`,
    qs: {
      name: boardName,
      defaultLists: false,
      key,
      token,
    },
  })
    .then((boardResponse) => {
      expect(boardResponse.status).to.eq(200);

      boardId = boardResponse.body.id;
      boardUrl = boardResponse.body.url || boardResponse.body.shortUrl;

      return cy.request({
        method: "POST",
        url: `${apiBaseUrl}/lists`,
        qs: {
          name: listName,
          idBoard: boardId,
          key,
          token,
        },
      });
    })
    .then((listResponse) => {
      expect(listResponse.status).to.eq(200);

      listId = listResponse.body.id;

      return cy.request({
        method: "POST",
        url: `${apiBaseUrl}/cards`,
        qs: {
          name: templateName,
          idList: listId,
          key,
          token,
        },
      });
    })
    .then((cardResponse) => {
      expect(cardResponse.status).to.eq(200);

      cardId = cardResponse.body.id;

      return cy.request({
        method: "PUT",
        url: `${apiBaseUrl}/cards/${cardId}`,
        qs: {
          isTemplate: true,
          key,
          token,
        },
      });
    })
    .then((templateResponse) => {
      expect(templateResponse.status).to.eq(200);
      expect(templateResponse.body.isTemplate).to.eq(true);
      expect(templateResponse.body.closed).to.eq(false);
    });
});

after(() => {
  if (boardId) {
    cy.request({
      method: "DELETE",
      url: `${apiBaseUrl}/boards/${boardId}`,
      qs: {
        key,
        token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect([200, 404]).to.include(response.status);
    });
  }
});

Given("The user opens the board that contains a visible template card", () => {
  cy.LoginToTrello();

  expect(boardUrl, "Board URL").to.exist;

  actions.openBoard(boardUrl, listName);
});

When("The user opens the template card", () => {
  actions.openTemplateCard(templateName);
});

When("The user hides the template from the list", () => {
  actions.hideTemplateFromList(cardId, key, token);
});

Then("The template should not be displayed in the list", () => {
  actions.closeCardModal();
  actions.reloadBoard(listName);

  assertions.templateHiddenByApi(cardId, key, token);
  assertions.templateNotVisibleOnBoard(templateName);
});