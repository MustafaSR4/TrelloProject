Feature: Update Card Template Functionality in Trello website

  Scenario: Validate that user can update template name
    Given The user creates a template card for updating using API
    When The user navigates to the board for updating template name
    And The user updates the template name using UI
    Then Validate that the template name is updated successfully