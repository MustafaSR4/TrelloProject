class UpdateTemplateActions {
  openBoard(boardUrl, listName, templateName) {
    cy.viewport(1440, 900)
    cy.visit(boardUrl)

    cy.url({ timeout: 30000 }).should("include", "trello.com")
    cy.get("body", { timeout: 30000 }).should("be.visible")

    this.closeTrelloPopups()

    cy.contains(listName, { timeout: 30000 }).should("be.visible")
    cy.contains(templateName, { timeout: 30000 }).should("be.visible")

    return this
  }

  updateTemplateNameUsingUI(oldTemplateName, newTemplateName) {
    this.openTemplateCard(oldTemplateName)
    this.changeOpenedCardTitle(newTemplateName)
    this.closeCardModal()
    this.reloadBoard()

    return this
  }

  openTemplateCard(templateName) {
    cy.contains(
      '[data-testid="card-name"], [data-testid="trello-card"], a[href*="/c/"], .list-card, span, div',
      templateName,
      { timeout: 30000 }
    )
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true })

    cy.get("body", { timeout: 30000 }).should("contain", templateName)

    cy.get(this.cardTitleInputSelector(), { timeout: 30000 })
      .filter(":visible")
      .first()
      .should("be.visible")

    return this
  }

  changeOpenedCardTitle(newTemplateName) {
    cy.get(this.cardTitleInputSelector(), { timeout: 30000 })
      .filter(":visible")
      .first()
      .click({ force: true })
      .clear({ force: true })
      .type(newTemplateName, { force: true, delay: 20 })
      .blur({ force: true })

    cy.wait(2000)

    cy.get("body", { timeout: 30000 }).should("contain", newTemplateName)

    return this
  }

  closeCardModal() {
    const closeButtonSelector = [
      'button[aria-label="Close"]',
      'button[aria-label="Close dialog"]',
      'button[aria-label="Close card"]',
      '[data-testid="modal-close-button"]',
      'a.js-close-window',
      'button.js-close-window',
    ].join(", ")

    cy.get("body", { timeout: 30000 }).then(($body) => {
      const closeButtonExists =
        $body.find(closeButtonSelector).filter(":visible").length > 0

      if (closeButtonExists) {
        cy.get(closeButtonSelector)
          .filter(":visible")
          .first()
          .click({ force: true })
      } else {
        cy.get("body").type("{esc}", { force: true })
      }
    })

    cy.wait(1000)

    return this
  }

  reloadBoard() {
    cy.reload()

    cy.get("body", { timeout: 30000 }).should("be.visible")

    this.closeTrelloPopups()

    cy.screenshot("r2-template-board-after-update-full-page", {
      capture: "fullPage",
    })

    return this
  }

  closeTrelloPopups() {
    cy.wait(1000)

    cy.get("body", { timeout: 30000 }).then(($body) => {
      const popupTexts = [
        "Power your projects with Jira",
        "Upgrade for Views",
        "Try it free",
        "Upgrade Workspace to Premium",
        "Accept all",
        "Only necessary",
      ]

      const hasPopup = popupTexts.some((text) => $body.text().includes(text))

      if (hasPopup) {
        cy.get("body").type("{esc}", { force: true })
      }
    })

    cy.wait(700)

    return this
  }

  cardTitleInputSelector() {
    return [
      'textarea[data-testid="card-back-title-input"]',
      'textarea.js-card-detail-title-input',
      'textarea[aria-label="Card title"]',
      'textarea[aria-label="Card name"]',
      'textarea[placeholder="Enter card title"]',
      'textarea[placeholder="Enter a title for this card"]',
      'input[aria-label="Card title"]',
      'input[aria-label="Card name"]',
    ].join(", ")
  }
}

export default UpdateTemplateActions