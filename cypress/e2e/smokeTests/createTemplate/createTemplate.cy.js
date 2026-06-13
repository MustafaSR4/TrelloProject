import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import CreateTemplateActions from "../../../pageObjects/createTemplate/Actions.cy"
import CreateTemplateAssertions from "../../../pageObjects/createTemplate/Assertions.cy"
import dataUtils from "../../../support/dataUtils.cy"

const dataUtil = new dataUtils()
const createTemplateAction = new CreateTemplateActions()
const createTemplateAssertion = new CreateTemplateAssertions()

let boardId
let boardUrl
let listId

const boardName = `Template Board ${Date.now()}`
const listName = "To Do"
const templateName = `Card Template ${Date.now()}`

before(() => {
  return dataUtil
    .createBoard(boardName)
    .then((boardResponse) => {
      expect(boardResponse.status).to.eq(200)

      boardId = boardResponse.body.id
      boardUrl = boardResponse.body.url

      return dataUtil.createList(boardId, listName)
    })
    .then((listResponse) => {
      expect(listResponse.status).to.eq(200)
      listId = listResponse.body.id

      return cy.LoginToTrello()
    })
})

Given("The user navigates to the board for creating card template", () => {
  createTemplateAction.openBoard(boardUrl, listName)
})

When("The user creates a new card template from the list", () => {
  createTemplateAction.createTemplateFromList(listName, templateName)

  cy.screenshot("r1-create-template-full-page", {
    capture: "fullPage",
  })
})

Then("Validate that the card template is created successfully", () => {
  createTemplateAssertion.checkTemplateCreated(templateName)
  createTemplateAssertion.checkTemplateCreatedByApi(dataUtil, listId, templateName)
})

after(() => {
  if (!boardId) return

  return dataUtil.deleteBoard(boardId).then((response) => {
    expect(response.status).to.eq(200)
  })
})