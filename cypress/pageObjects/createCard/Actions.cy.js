class CreateCardActions {

    openBoard(url) {
        cy.visit(url);
        return this;
    }
    clickOnAddCardButton() {
       cy.findByTestId('list-add-card-button').first().click()
       return this;
    }

    typeInCardTitleField(cardName) {
       cy.findByTestId('list-card-composer-textarea').type(cardName)
       return this;
    }

    clickAddCardButtonInPopup() {
        cy.findByTestId('list-card-composer-add-card-button').click()
        return this;
    }
}

export default CreateCardActions;