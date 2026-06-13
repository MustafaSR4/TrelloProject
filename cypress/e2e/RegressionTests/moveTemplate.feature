Feature: Move template card

  Scenario: Validate user can move Template To any List
    Given The user opens the board that contains a template card
    When The user opens the template card
    And The user moves the template to another list
    Then The template should be moved successfully to the target list