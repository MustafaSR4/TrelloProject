Feature: Hide template card from list

  Scenario: Validate user can hide Template from List
    Given The user opens the board that contains a visible template card
    When The user opens the template card
    And The user hides the template from the list
    Then The template should not be displayed in the list