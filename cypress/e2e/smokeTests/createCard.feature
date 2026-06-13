Feature: Create Card Functionality in Trello website

    Scenario: Validate that the user can create a card
        Given The user navigates to the Board
        When The user clicks on add a card button
        And The user types card title in the card title field
        And The user clicks on add card button
        Then Validate that the card is created successfully
        