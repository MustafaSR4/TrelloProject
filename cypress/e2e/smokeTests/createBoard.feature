Feature: Create Board in Trello website

  Scenario: Validate that the user can create a board
    Given open trello website and login
    When click on create button in navbar
    And click on create board button
    And enter board name
    And click on create button
    Then validate that the board is created successfully