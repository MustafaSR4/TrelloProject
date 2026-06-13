class HideTemplateAssertions {
  templateHiddenByApi(cardId, key, token) {
    expect(cardId, "Template card id").to.exist;

    cy.request({
      method: "GET",
      url: `https://api.trello.com/1/cards/${cardId}`,
      qs: {
        fields: "closed,isTemplate",
        key,
        token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.closed).to.eq(true);
      expect(response.body.isTemplate).to.eq(true);
    });

    return this;
  }

  templateNotVisibleOnBoard(templateName) {
    const cardSelector =
      '[data-testid="card-name"], [data-testid="card-front-title"], a[href*="/c/"]';

    cy.get("body", { timeout: 30000 })
      .should("be.visible")
      .then(($body) => {
        const visibleMatchingCards = $body
          .find(cardSelector)
          .filter(":visible")
          .toArray()
          .filter((element) => {
            const text = element.innerText || element.textContent || "";
            return text.trim().includes(templateName);
          });

        expect(
          visibleMatchingCards,
          `Visible cards with name "${templateName}"`
        ).to.have.length(0);
      });

    return this;
  }
}

export default HideTemplateAssertions;