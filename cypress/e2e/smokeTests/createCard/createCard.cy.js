import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import CreateCardActions from "../../../pageObjects/createCard/Actions.cy"
import dataUtils from "../../../support/dataUtils.cy"
import createCardAssertions from "../../../pageObjects/createCard/Assertions.cy"

const dataUtil = new dataUtils()
let boardUrl
let boardId
const CreateCardAction = new CreateCardActions()
const cardName = "cyCard"
const createCardAssertion = new createCardAssertions()

before(() => {
dataUtil.createBoard("cyBoard").then((response) => {
    boardUrl=response.body.url
     boardId=response.body.id
})
cy.LoginToTrello()
})


Given('The user navigates to the Board', () => {
    CreateCardAction.openBoard(boardUrl)
})
When('The user clicks on add a card button', () => {
   CreateCardAction.clickOnAddCardButton()
})
When('The user types card title in the card title field', () => {
    CreateCardAction.typeInCardTitleField(cardName)
})
When('The user clicks on add card button', () => {
    CreateCardAction.clickAddCardButtonInPopup()
})
Then('Validate that the card is created successfully', () => {
    createCardAssertion.checkCardTitleIsContain(cardName)
})
after(() => {
  cy.visit("https://trello.com/")

  dataUtil.deleteBoard(boardId).then((response) => {
    expect(response.status).to.eq(200)
  })
})

