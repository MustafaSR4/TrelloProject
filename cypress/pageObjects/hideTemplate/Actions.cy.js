class HideTemplateActions {
  openBoard(boardUrl, listName) {
    cy.viewport(1440, 900);

    cy.visit(boardUrl);

    cy.url({ timeout: 30000 }).should("include", "/b/");
    cy.get("body", { timeout: 30000 }).should("be.visible");

    this.closeTrelloPopups();
    this.assertListVisible(listName);

    return this;
  }

  reloadBoard(listName) {
    cy.reload();

    cy.url({ timeout: 30000 }).should("include", "/b/");
    cy.get("body", { timeout: 30000 }).should("be.visible");

    this.closeTrelloPopups();
    this.assertListVisible(listName);

    return this;
  }

  assertListVisible(listName) {
    const listNamePattern = new RegExp(
      `^\\s*${this.escapeRegExp(listName)}\\s*$`
    );

    cy.contains(
      '[data-testid="list-name"], [data-testid="list-header-name"], textarea, h2, div',
      listNamePattern,
      { timeout: 30000 }
    ).should("be.visible");

    return this;
  }

  openTemplateCard(templateName) {
    const templateNamePattern = new RegExp(
      `^\\s*${this.escapeRegExp(templateName)}\\s*$`
    );

    cy.contains(
      '[data-testid="card-name"], [data-testid="card-front-title"], a[href*="/c/"], span, div',
      templateNamePattern,
      { timeout: 30000 }
    )
      .should("be.visible")
      .click({ force: true });

    cy.get("body", { timeout: 30000 }).should("contain", templateName);

    return this;
  }

  hideTemplateFromList(cardId, key, token) {
    expect(cardId, "Template card id").to.exist;

    cy.request({
      method: "PUT",
      url: `https://api.trello.com/1/cards/${cardId}`,
      qs: {
        closed: true,
        key,
        token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.closed).to.eq(true);
      expect(response.body.isTemplate).to.eq(true);
    });

    cy.wait(1000);

    return this;
  }

  closeCardModal() {
    cy.get("body").then(($body) => {
      const closeButton = $body
        .find(
          'button[aria-label*="Close"], button[title*="Close"], a[aria-label*="Close"], button[data-testid*="close"]'
        )
        .filter(":visible")
        .last();

      if (closeButton.length > 0) {
        cy.wrap(closeButton).click({ force: true });
      } else {
        cy.get("body").type("{esc}", { force: true });
      }
    });

    cy.wait(1000);

    return this;
  }

  closeTrelloPopups() {
    cy.get("body").then(($body) => {
      const popupTexts = [
        /^Got it$/i,
        /^Skip$/i,
        /^Maybe later$/i,
        /^Not now$/i,
        /^I’ll do this later$/i,
        /^I'll do this later$/i,
      ];

      popupTexts.forEach((textPattern) => {
        const popupButton = $body
          .find('button, a, [role="button"]')
          .filter(":visible")
          .filter((index, element) => {
            const text = element.innerText || element.getAttribute("aria-label") || "";
            return textPattern.test(text.trim());
          })
          .first();

        if (popupButton.length > 0) {
          cy.wrap(popupButton).click({ force: true });
        }
      });
    });

    return this;
  }

  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export default HideTemplateActions;