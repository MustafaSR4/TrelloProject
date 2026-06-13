class UpdateTemplateAssertions {
  checkTemplateNameUpdated(oldTemplateName, newTemplateName) {
    cy.contains(
      '[data-testid="card-name"], [data-testid="trello-card"], a[href*="/c/"], .list-card, span, div',
      newTemplateName,
      { timeout: 30000 }
    )
      .scrollIntoView()
      .should("be.visible")

    cy.contains(oldTemplateName, { timeout: 5000 }).should("not.exist")

    return this
  }
}

export default UpdateTemplateAssertions