class MoveTemplateActions {
  openBoard(boardUrl, sourceListName, targetListName) {
    cy.viewport(1440, 900);
    cy.visit(boardUrl);

    cy.url({ timeout: 30000 }).should("include", "/b/");
    cy.get("body", { timeout: 30000 }).should("be.visible");

    this.closeTrelloPopups();

    this.getListByName(sourceListName).should("be.visible");
    this.getListByName(targetListName).should("be.visible");

    return this;
  }

  openTemplateCard(sourceListName, templateName) {
    this.getCardInList(sourceListName, templateName)
      .should("be.visible")
      .click({ force: true });

    cy.url({ timeout: 30000 }).should("include", "/c/");

    cy.get('[role="dialog"], [data-testid="card-back"], .window', {
      timeout: 30000,
    })
      .filter(":visible")
      .first()
      .should("contain.text", templateName);

    return this;
  }

  moveOpenedTemplateToList(sourceListName, targetListName, templateName) {
    this.openListDropdownFromCardModal(sourceListName);
    this.selectTargetListFromDropdown(targetListName);
    this.confirmMoveIfNeeded();

    cy.wait(2500);

    this.closeCardModalIfOpen();

    cy.wait(1500);

    this.getCardInList(targetListName, templateName).should("be.visible");

    return this;
  }

  openListDropdownFromCardModal(sourceListName) {
    const sourceListRegex = new RegExp(this.escapeRegExp(sourceListName), "i");

    cy.get('[role="dialog"], [data-testid="card-back"], .window', {
      timeout: 30000,
    })
      .filter(":visible")
      .first()
      .within(() => {
        cy.contains(
          'button, [role="button"], a, span, div',
          sourceListRegex,
          { timeout: 30000 }
        )
          .should("be.visible")
          .click({ force: true });
      });

    cy.wait(1000);

    return this;
  }

  selectTargetListFromDropdown(targetListName) {
    const targetListRegex = new RegExp(this.escapeRegExp(targetListName), "i");

    cy.get("body", { timeout: 30000 }).then(($body) => {
      const targetOption = $body
        .find(
          [
            '[role="option"]',
            '[role="menuitem"]',
            '[role="menuitemradio"]',
            '[data-testid*="option"]',
            '[data-testid*="list"]',
            "button",
            "li",
            "span",
            "div",
          ].join(", ")
        )
        .filter(":visible")
        .filter((index, element) => {
          return targetListRegex.test(element.innerText.trim());
        })
        .last();

      expect(
        targetOption.length,
        `Target list option should exist: ${targetListName}`
      ).to.be.greaterThan(0);

      cy.wrap(targetOption).click({ force: true });
    });

    cy.wait(1000);

    return this;
  }

  confirmMoveIfNeeded() {
    cy.get("body").then(($body) => {
      const moveButton = $body
        .find(
          [
            '[data-testid="move-card-popover-move-button"]',
            'button[type="submit"]',
            "button",
          ].join(", ")
        )
        .filter(":visible")
        .filter((index, element) => {
          return /^Move$/i.test(element.innerText.trim());
        })
        .last();

      if (moveButton.length > 0) {
        cy.wrap(moveButton).click({ force: true });
      }
    });

    cy.wait(1500);

    return this;
  }

  closeCardModalIfOpen() {
    cy.get("body").then(($body) => {
      const openedModal = $body
        .find('[role="dialog"], .window, [data-testid="card-back"]')
        .filter(":visible");

      if (openedModal.length === 0) {
        return;
      }

      const closeButton = $body
        .find(
          [
            '[aria-label="Close dialog"]',
            '[aria-label="Close"]',
            'button[title="Close"]',
            '[data-testid="CloseIcon"]',
          ].join(", ")
        )
        .filter(":visible")
        .first();

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
      const popupButtonRegexList = [
        /^Not now$/i,
        /^Maybe later$/i,
        /^Skip$/i,
        /^Got it$/i,
        /^Continue$/i,
        /^I'll do this later$/i,
      ];

      for (const regex of popupButtonRegexList) {
        const button = [...$body.find("button")]
          .filter((element) => Cypress.$(element).is(":visible"))
          .find((element) => regex.test(element.innerText.trim()));

        if (button) {
          cy.wrap(button).click({ force: true });
          break;
        }
      }
    });

    return this;
  }

  getCardInList(listName, cardName) {
  const cardNameRegex = new RegExp(
    `^\\s*${this.escapeRegExp(cardName)}\\s*$`
  );

  return this.getListByName(listName).then(($list) => {
    return cy
      .wrap($list)
      .contains(
        '[data-testid="card-name"], [data-testid="card-front"], [data-testid="trello-card"], a[href*="/c/"], span, div',
        cardNameRegex,
        { timeout: 30000 }
      )
      .should("be.visible");
  });
}

  getListByName(listName) {
  const listNameRegex = new RegExp(
    `^\\s*${this.escapeRegExp(listName)}\\s*$`
  );

  return cy
    .contains(
      '[data-testid="list-name"], textarea, h2, h3, div',
      listNameRegex,
      { timeout: 30000 }
    )
    .should("be.visible")
    .then(($listTitle) => {
      let currentElement = $listTitle[0];
      let listContainer = null;

      for (let i = 0; i < 10; i++) {
        if (!currentElement) {
          break;
        }

        const text = currentElement.innerText || "";

        if (
          text.includes(listName) &&
          /Add a card|Add card/i.test(text)
        ) {
          listContainer = currentElement;
          break;
        }

        currentElement = currentElement.parentElement;
      }

      expect(
        listContainer,
        `List container should exist for list: ${listName}`
      ).to.exist;

      return cy.wrap(listContainer);
    });
}

  escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export default MoveTemplateActions;