import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"
import SharedActions from "../../../pageObjects/shared/Actions.cy"
import CreateBoardActions from "../../../pageObjects/createBoard/Actions.cy"
import CreateBoardAssertions from "../../../pageObjects/createBoard/Assertions.cy"

const sharedAction = new SharedActions()
const createBoardAction = new CreateBoardActions()
const createBoardAssertion = new CreateBoardAssertions()

Given("open trello website and login", () => {
  sharedAction.LoginToTrello()
})

When("click on create button in navbar", () => {
  createBoardAction.createOnBoardButton()
})

When("click on create board button", () => {
  createBoardAction.chooseBoardOption()
})

When("enter board name", () => {
  createBoardAction.typeBoardTitle("board1")
})

When("click on create button", () => {
  createBoardAction.clickOnCreateButton()
})

Then("validate that the board is created successfully", () => {
  createBoardAssertion.checkURLIsContain("board1").checkBoardNameIsContain("board1")
})