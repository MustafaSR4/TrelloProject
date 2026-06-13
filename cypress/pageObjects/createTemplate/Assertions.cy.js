class CreateTemplateAssertions {
  checkTemplateCreated(templateName) {
    cy.contains("a, div, span", templateName, { timeout: 30000 })
      .scrollIntoView()
      .should("be.visible")

    return this
  }

  checkTemplateCreatedByApi(dataUtil, listId, templateName) {
    return dataUtil.getCardsOnList(listId).then((cardsResponse) => {
      expect(cardsResponse.status).to.eq(200)

      const createdTemplateCard = cardsResponse.body.find(
        (card) => card.name === templateName
      )

      expect(createdTemplateCard, "Created template card").to.exist

      const isTemplate =
        createdTemplateCard.isTemplate === true ||
        createdTemplateCard.cardRole === "template"

      expect(isTemplate, "Card should be template").to.eq(true)
    })
  }
}

export default CreateTemplateAssertions