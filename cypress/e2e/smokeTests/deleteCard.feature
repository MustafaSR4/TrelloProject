Feature: Delete Card Functionality in Trello website

  Scenario: Validate that the user can delete an existing card
    Given The user navigates to the Board
    When The user opens the existing card
    And The user archives the card from the UI
    And The user deletes the card permanently from the UI
    Then Validate that the card is deleted successfully