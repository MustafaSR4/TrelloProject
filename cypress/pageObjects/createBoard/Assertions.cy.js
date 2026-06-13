class createBoardAssertions {
   checkURLIsContain   (boardName) {
    cy.url().should('contain', boardName)
    return this;
  }
  checkBoardNameIsContain(boardName) {
    cy.findByTestId('board-name-display').should('contain', boardName)
    return this;
  }

}
export default createBoardAssertions; 