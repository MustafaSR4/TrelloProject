class createCardAssertions {
checkCardTitleIsContain(cardName){
    cy.findByTestId('card-name').should('contain',cardName)

}


}export default createCardAssertions;