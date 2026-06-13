import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import DeleteCardActions from "../../../pageObjects/deleteCard/Actions.cy"
import DeleteCardAssertions from "../../../pageObjects/deleteCard/Assertions.cy"
import dataUtils from "../../../support/dataUtils.cy"

const dataUtil = new dataUtils()
const deleteCardAction = new DeleteCardActions()
const deleteCardAssertion = new DeleteCardAssertions()

let boardUrl
let boardId

const boardName = `Delete Card Board ${Date.now()}`
const listName = "To Do"
const cardName = `Card To Delete ${Date.now()}`

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

      return dataUtil.createCard(listResponse.body.id, cardName)
    })
    .then((cardResponse) => {
      expect(cardResponse.status).to.eq(200)
      expect(cardResponse.body.name).to.eq(cardName)
    })
    .then(() => {
      cy.LoginToTrello()
    })
})

Given("The user navigates to the Board", () => {
  deleteCardAction.openBoard(boardUrl)

  cy.screenshot("r0-board-opened-full-page", {
    capture: "fullPage",
  })
})

When("The user opens the existing card", () => {
  deleteCardAction.openCard(cardName)
})

When("The user archives the card from the UI", () => {
  deleteCardAction.archiveCard()
})

When("The user deletes the card permanently from the UI", () => {
  deleteCardAction.deleteCard()
})

Then("Validate that the card is deleted successfully", () => {
  deleteCardAssertion.checkCardDeleted(cardName)
})

after(() => {
  if (!boardId) return

  return dataUtil.deleteBoard(boardId).then((response) => {
    expect(response.status).to.eq(200)
  })
})