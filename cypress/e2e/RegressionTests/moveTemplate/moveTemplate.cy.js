import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import MoveTemplateActions from "../../../pageObjects/moveTemplate/Actions.cy";
import MoveTemplateAssertions from "../../../pageObjects/moveTemplate/Assertions.cy";
import { APIKey, APIToken } from "../../../support/Constants.cy";

const actions = new MoveTemplateActions();
const assertions = new MoveTemplateAssertions();

const apiBaseUrl = "https://api.trello.com/1";
const key = APIKey;
const token = APIToken;

let boardId;
let boardUrl;
let sourceListId;
let targetListId;
let cardId;

let boardName;
let templateName;

const sourceListName = "Source List";
const targetListName = "Target List";

before(() => {
  expect(key, "Trello API key").to.exist;
  expect(token, "Trello API token").to.exist;

  const uniqueNumber = Date.now();

  boardName = `Move Template Board ${uniqueNumber}`;
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
    .then((response) => {
      expect(response.status).to.eq(200);

      boardId = response.body.id;
      boardUrl = response.body.url;

      return cy.request({
        method: "POST",
        url: `${apiBaseUrl}/lists`,
        qs: {
          name: sourceListName,
          idBoard: boardId,
          pos: "top",
          key,
          token,
        },
      });
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      sourceListId = response.body.id;

      return cy.request({
        method: "POST",
        url: `${apiBaseUrl}/lists`,
        qs: {
          name: targetListName,
          idBoard: boardId,
          pos: "bottom",
          key,
          token,
        },
      });
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      targetListId = response.body.id;

      return cy.request({
        method: "POST",
        url: `${apiBaseUrl}/cards`,
        qs: {
          name: templateName,
          idList: sourceListId,
          key,
          token,
        },
      });
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      cardId = response.body.id;

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
    .then((response) => {
      expect(response.status).to.eq(200);

      return cy.request({
        method: "GET",
        url: `${apiBaseUrl}/cards/${cardId}`,
        qs: {
          fields: "idList,isTemplate,name",
          key,
          token,
        },
      });
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.idList).to.eq(sourceListId);
      expect(response.body.name).to.eq(templateName);
      expect(response.body.isTemplate).to.eq(true);
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
      expect([200, 202, 404]).to.include(response.status);
    });
  }
});

Given("The user opens the board that contains a template card", () => {
  cy.LoginToTrello();
  actions.openBoard(boardUrl, sourceListName, targetListName);
});

When("The user opens the template card", () => {
  actions.openTemplateCard(sourceListName, templateName);
});

When("The user moves the template to another list", () => {
  actions.closeCardModalIfOpen();

  cy.request({
    method: "PUT",
    url: `${apiBaseUrl}/cards/${cardId}`,
    qs: {
      idList: targetListId,
      key,
      token,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.idList).to.eq(targetListId);
  });
});

Then("The template should be moved successfully to the target list", () => {
  actions.openBoard(boardUrl, sourceListName, targetListName);

  assertions.templateVisibleInTargetList(targetListName, templateName);
  assertions.templateNotVisibleInSourceList(sourceListName, templateName);

  cy.request({
    method: "GET",
    url: `${apiBaseUrl}/cards/${cardId}`,
    qs: {
      fields: "idList,isTemplate",
      key,
      token,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.idList).to.eq(targetListId);
    expect(response.body.isTemplate).to.eq(true);
  });
});