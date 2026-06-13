class DeleteCardActions {
  openBoard(boardUrl) {
    cy.viewport(1440, 900)
    cy.visit(boardUrl)

    cy.url({ timeout: 30000 }).should("include", "trello.com")
    cy.get("body", { timeout: 30000 }).should("be.visible")

    return this
  }

  openCard(cardName) {
    cy.contains(cardName, { timeout: 30000 })
      .scrollIntoView()
      .click({ force: true })

    cy.url({ timeout: 30000 }).should("include", "/c/")

    cy.get("body", { timeout: 30000 }).should(($body) => {
      expect($body.text()).to.include(cardName)
    })

    cy.screenshot("r0-card-modal-opened", {
      capture: "fullPage",
    })

    return this
  }

  findVisibleElement($root, regex, selector = "button, a, span, div, [role='button']") {
    const elements = [
      ...$root.find(selector),
      ...$root.filter(selector),
    ]

    return elements.find((el) => {
      const $el = Cypress.$(el)

      const text = ($el.text() || "").trim()
      const ariaLabel = ($el.attr("aria-label") || "").trim()
      const title = ($el.attr("title") || "").trim()
      const testId = ($el.attr("data-testid") || "").trim()

      const values = [
        text,
        ariaLabel,
        title,
        testId,
        `${text} ${ariaLabel} ${title} ${testId}`.trim(),
      ]

      return $el.is(":visible") && values.some((value) => regex.test(value))
    })
  }

  archiveCard() {
  cy.get("body", { timeout: 30000 }).then(($body) => {
    const directArchiveButton = this.findVisibleElement(
      $body,
      /^(archive|archive card|أرشفة|أرشف)$/i,
      "button, a, [role='button']"
    )

    if (directArchiveButton) {
      cy.wrap(directArchiveButton)
        .scrollIntoView()
        .click({ force: true })

      return
    }

    const threeDotsButton = this.findVisibleElement(
      $body,
      /^(\.\.\.|…|more|actions|card actions)$/i,
      "button, a, [role='button']"
    )

    expect(threeDotsButton, "Three dots menu button was not found.").to.exist

    cy.wrap(threeDotsButton)
      .scrollIntoView()
      .click({ force: true })
  })

  cy.contains("button, a, [role='button']", /archive|archive card|أرشفة|أرشف/i, {
    timeout: 30000,
  })
    .should("be.visible")
    .click({ force: true })

  cy.wait(1500)

  cy.screenshot("r0-card-archived", {
    capture: "fullPage",
  })

  return this
}

  deleteCard() {
  cy.get("body", { timeout: 30000 }).then(($body) => {
    const deleteButton = this.findVisibleElement(
      $body,
      /delete|delete card|حذف/i,
      "button, a, span, div, [role='button']"
    )

    if (deleteButton) {
      cy.wrap(deleteButton)
        .scrollIntoView()
        .click({ force: true })

      return
    }

    const threeDotsButton = this.findVisibleElement(
      $body,
      /more|actions|\.\.\.|…/i,
      "button, a, span, div, [role='button']"
    )

    expect(threeDotsButton, "Three dots menu button was not found.").to.exist

    cy.wrap(threeDotsButton)
      .scrollIntoView()
      .click({ force: true })
  })

  cy.contains("button, a, span, div, [role='button']", /delete|delete card|حذف/i, {
    timeout: 30000,
  })
    .should("be.visible")
    .click({ force: true })

  cy.wait(1000)

  cy.screenshot("r0-delete-confirmation-opened", {
    capture: "fullPage",
  })

  return this
}

  confirmDeleteCard() {
    cy.get("body", { timeout: 30000 })
      .should(($body) => {
        const visibleDialog = $body
          .find("[role='dialog'], [data-testid='popover'], .atlaskit-portal-container, .js-pop-over")
          .filter(":visible")
          .last()

        const root = visibleDialog.length ? visibleDialog : $body

        const confirmDeleteButton = this.findVisibleElement(
          root,
          /^(delete|delete card|confirm|yes, delete|حذف)$/i,
          "button, input[type='submit'], [role='button']"
        )

        expect(confirmDeleteButton, "Confirm delete button was not found.").to.exist
      })
      .then(($body) => {
        const visibleDialog = $body
          .find("[role='dialog'], [data-testid='popover'], .atlaskit-portal-container, .js-pop-over")
          .filter(":visible")
          .last()

        const root = visibleDialog.length ? visibleDialog : $body

        const confirmDeleteButton = this.findVisibleElement(
          root,
          /^(delete|delete card|confirm|yes, delete|حذف)$/i,
          "button, input[type='submit'], [role='button']"
        )

        cy.wrap(confirmDeleteButton)
          .scrollIntoView()
          .click({ force: true })
      })

    cy.wait(2000)

    cy.screenshot("r0-card-deleted", {
      capture: "fullPage",
    })

    return this
  }
}

export default DeleteCardActions