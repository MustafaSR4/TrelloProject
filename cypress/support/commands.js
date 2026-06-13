// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('LoginToTrello',  () => { 
    cy.visit('/login')
    cy.wait(3000);
    cy.fixture('trelloUser').then((data) => {
    cy.findByTestId('username').type(data.email);
    cy.findByTestId('login-submit-idf-testid').click()
    cy.wait(3000)
    cy.findByTestId('password').type(data.password)
    cy.findByTestId('login-submit-idf-testid').click()
    cy.wait(6000);
    })
    
 })

 Cypress.Commands.add('findByTestId',  (testId) => { 
    return cy.get(`[data-testid=${testId}]`)

    })
