Feature: Create Card Template Functionality in Trello website

  Scenario: Validate that user can create new template
    Given The user navigates to the board for creating card template
    When The user creates a new card template from the list
    Then Validate that the card template is created successfully