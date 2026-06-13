class MoveTemplateAssertions {
  templateVisibleInTargetList(targetListName, templateName) {
    const templateNameRegex = new RegExp(
      `^\\s*${this.escapeRegExp(templateName)}\\s*$`
    );

    this.getListByName(targetListName).then(($list) => {
      cy.wrap($list)
        .contains(
          '[data-testid="card-name"], [data-testid="card-front"], [data-testid="trello-card"], a[href*="/c/"], span, div',
          templateNameRegex,
          { timeout: 30000 }
        )
        .should("be.visible");
    });

    return this;
  }

  templateNotVisibleInSourceList(sourceListName, templateName) {
    this.getListByName(sourceListName).then(($list) => {
      cy.wrap($list).should("not.contain.text", templateName);
    });

    return this;
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

export default MoveTemplateAssertions;