class CreateTemplateActions {
  openBoard(boardUrl, listName) {
    cy.viewport(1440, 900)
    cy.visit(boardUrl)

    cy.url({ timeout: 30000 }).should("include", "trello.com")
    cy.get("body", { timeout: 30000 }).should("be.visible")

    this.closeTrelloPopups()

    cy.contains(listName, { timeout: 30000 }).should("be.visible")

    return this
  }

  createTemplateFromList(listName, templateName) {
    this.addCardToList(listName, templateName)
    this.openCard(templateName)
    this.makeOpenedCardTemplate()
    this.closeCardModal()

    return this
  }

  addCardToList(listName, templateName) {
    this.getListByName(listName).within(() => {
      cy.contains("button, a, span, div", /add a card|add card/i, {
        timeout: 30000,
      }).click({ force: true })

      cy.focused({ timeout: 30000 })
        .clear({ force: true })
        .type(templateName, { force: true })

      cy.contains("button", /^Add card$/i, { timeout: 30000 }).click({
        force: true,
      })
    })

    cy.contains("a, div, span", templateName, { timeout: 30000 }).should(
      "be.visible"
    )

    return this
  }

  openCard(templateName) {
    cy.wait(1000)

    cy.get("body", { timeout: 30000 }).then(($body) => {
      const cardByTestId = $body
        .find('[data-testid="card-name"], a[href*="/c/"]')
        .filter((index, element) => {
          return element.innerText?.trim().includes(templateName)
        })
        .filter(":visible")
        .first()

      if (cardByTestId.length) {
        cy.wrap(cardByTestId).click({ force: true })
      } else {
        cy.contains("a, div, span", templateName, {
          timeout: 30000,
        }).click({ force: true })
      }
    })

    this.assertCardModalOpened(templateName)

    return this
  }

  assertCardModalOpened(templateName) {
    cy.get("body", { timeout: 30000 }).should(($body) => {
      const modal = $body
        .find('[data-testid="card-back-modal"], [role="dialog"], .window')
        .filter(":visible")

      expect(modal.length, "Card modal should be opened").to.be.greaterThan(0)
      expect($body.text(), "Card name should appear in opened modal").to.include(
        templateName
      )
    })

    return this
  }

  makeOpenedCardTemplate() {
  cy.wait(1000)

  cy.get("body", { timeout: 30000 }).then(($body) => {
    const modal = $body
      .find('[data-testid="card-back-modal"], [role="dialog"], .window')
      .filter(":visible")
      .first()

    if (!modal.length) {
      throw new Error("Card modal was not opened, so Make template cannot be clicked.")
    }

    const makeTemplateButton = modal
      .find("button, a, span, div")
      .filter((index, element) => {
        const text = element.innerText?.trim()
        return /make template/i.test(text) && Cypress.$(element).is(":visible")
      })
      .first()

    if (makeTemplateButton.length) {
      cy.wrap(makeTemplateButton).click({ force: true })
      return
    }

    this.clickRealCardThreeDotsButton(modal)
  })

  cy.wait(1000)

  cy.contains("button, a, span, div", /make template/i, {
    timeout: 30000,
  }).click({ force: true })

  cy.wait(1500)

  return this
}
clickRealCardThreeDotsButton(modal) {
  cy.wrap(modal).then(($modal) => {
    const modalElement = $modal[0]
    const modalRect = modalElement.getBoundingClientRect()

    const visibleButtons = Array.from($modal.find("button")).filter((button) => {
      const rect = button.getBoundingClientRect()
      const text = button.innerText?.trim() || ""
      const ariaLabel = button.getAttribute("aria-label") || ""
      const title = button.getAttribute("title") || ""

      const isVisible =
        rect.width > 0 &&
        rect.height > 0 &&
        Cypress.$(button).is(":visible")

      const isTopRightButton =
        rect.top >= modalRect.top &&
        rect.top <= modalRect.top + 45 &&
        rect.left >= modalRect.right - 120

      const isNotCloseButton =
        !/close/i.test(text) &&
        !/close/i.test(ariaLabel) &&
        !/close/i.test(title)

      return isVisible && isTopRightButton && isNotCloseButton
    })

    if (!visibleButtons.length) {
      throw new Error("No visible top-right card modal buttons were found.")
    }

    visibleButtons.sort((buttonA, buttonB) => {
      return buttonB.getBoundingClientRect().left - buttonA.getBoundingClientRect().left
    })

    const threeDotsButton = visibleButtons.find((button) => {
      const text = button.innerText?.trim()
      const ariaLabel = button.getAttribute("aria-label") || ""
      const title = button.getAttribute("title") || ""

      return (
        text === "..." ||
        text === "…" ||
        text === "•••" ||
        /more/i.test(ariaLabel) ||
        /more/i.test(title) ||
        /actions/i.test(ariaLabel) ||
        /actions/i.test(title)
      )
    }) || visibleButtons[0]

    cy.wrap(threeDotsButton).click({ force: true })
  })

  return this
}

 openCardMoreMenuFromModal(modal) {
  const moreButton = modal
    .find(
      [
        '[data-testid="card-back-overflow-menu-button"]',
        '[data-testid="card-back-more-button"]',
        '[data-testid*="overflow"]',
        '[data-testid*="more"]',
        'button[aria-label*="More"]',
        'button[aria-label*="more"]',
        'button[aria-label*="actions"]',
        'button[title*="More"]',
        'button[title*="more"]',
      ].join(", ")
    )
    .filter(":visible")
    .first()

  if (moreButton.length) {
    cy.wrap(moreButton).click({ force: true })
    return this
  }

  const dotsButton = modal
    .find("button, a, span, div")
    .filter((index, element) => {
      const text = element.innerText?.trim()
      return (
        (text === "..." || text === "…" || text === "•••") &&
        Cypress.$(element).is(":visible")
      )
    })
    .first()

  if (dotsButton.length) {
    cy.wrap(dotsButton).click({ force: true })
    return this
  }

  cy.wrap(modal).then(($modal) => {
    const width = $modal.outerWidth()

    cy.wrap($modal).click(width - 45, 18, {
      force: true,
    })
  })

  return this
}

  closeCardModal() {
    cy.get("body").type("{esc}", { force: true })
    cy.wait(1000)

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
        "Maybe later",
        "Skip",
      ]

      const hasPopup = popupTexts.some((text) => $body.text().includes(text))

      if (hasPopup) {
        cy.get("body").type("{esc}", { force: true })
      }
    })

    cy.wait(700)

    return this
  }

  getListByName(listName) {
    return cy
      .contains("h2, textarea, div, span", new RegExp(`^\\s*${listName}\\s*$`), {
        timeout: 30000,
      })
      .then(($listTitle) => {
        const listByTestId = $listTitle.closest('[data-testid="list"]')

        if (listByTestId.length) {
          return cy.wrap(listByTestId)
        }

        const listByLi = $listTitle.parents("li").first()

        if (listByLi.length) {
          return cy.wrap(listByLi)
        }

        return cy.wrap($listTitle.parents("div").eq(4))
      })
  }
}

export default CreateTemplateActions