class DeleteCardAssertions {
  checkCardDeleted(cardName) {
    cy.location("pathname", { timeout: 30000 }).should("not.include", "/c/")

    cy.get("body", { timeout: 30000 }).should(($body) => {
      const visibleCardsText = $body
        .find("[data-testid='list-card'], a[href*='/c/']")
        .filter(":visible")
        .text()

      expect(visibleCardsText).not.to.include(cardName)
    })

    return this
  }
}

export default DeleteCardAssertions