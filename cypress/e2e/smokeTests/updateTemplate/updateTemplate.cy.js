import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import UpdateTemplateActions from "../../../pageObjects/updateTemplate/Actions.cy"
import UpdateTemplateAssertions from "../../../pageObjects/updateTemplate/Assertions.cy"
import dataUtils from "../../../support/dataUtils.cy"

const dataUtil = new dataUtils()
const updateTemplateAction = new UpdateTemplateActions()
const updateTemplateAssertion = new UpdateTemplateAssertions()

let boardId
let boardUrl
let listId
let cardId

const uniqueNumber = Date.now()

const boardName = `Update Template Board ${uniqueNumber}`
const listName = "To Do"
const templateName = `Card Template ${uniqueNumber}`
const updatedTemplateName = `Updated Template ${uniqueNumber}`

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

      cy.LoginToTrello()
    })
})

Given("The user creates a template card for updating using API", () => {
  dataUtil.createTemplateCard(listId, templateName).then((cardResponse) => {
    expect(cardResponse.status).to.eq(200)

    cardId = cardResponse.body.id
    expect(cardResponse.body.name).to.eq(templateName)
  })
})

When("The user navigates to the board for updating template name", () => {
  updateTemplateAction.openBoard(boardUrl, listName, templateName)

  cy.screenshot("r2-template-board-before-update-full-page", {
    capture: "fullPage",
  })
})

When("The user updates the template name using UI", () => {
  updateTemplateAction.updateTemplateNameUsingUI(
    templateName,
    updatedTemplateName
  )
})

Then("Validate that the template name is updated successfully", () => {
  updateTemplateAssertion.checkTemplateNameUpdated(
    templateName,
    updatedTemplateName
  )

  dataUtil.getCard(cardId).then((cardResponse) => {
    expect(cardResponse.status).to.eq(200)
    expect(cardResponse.body.name).to.eq(updatedTemplateName)
  })
})

after(() => {
  if (!boardId) return

  dataUtil.deleteBoard(boardId).then((response) => {
    expect(response.status).to.eq(200)
  })
})