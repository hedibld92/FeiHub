import '@testing-library/cypress/add-commands'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-button]').click()
  // Attendre que la redirection soit effectuée
  cy.url().should('include', '/dashboard')
})

// Commande pour créer une tâche
Cypress.Commands.add('createTask', ({ title, description, priority = 'medium' }) => {
  cy.get('[data-cy=new-task-button]').click()
  cy.get('[data-cy=task-title-input]').type(title)
  cy.get('[data-cy=task-description-input]').type(description)
  cy.get(`[data-cy=priority-${priority}]`).click()
  cy.get('[data-cy=create-task-button]').click()
  // Vérifier que la tâche a été créée
  cy.contains(title).should('be.visible')
})

// Commande pour créer une note
Cypress.Commands.add('createNote', ({ title, content, isPinned = false }) => {
  cy.get('[data-cy=new-note-button]').click()
  cy.get('[data-cy=note-title-input]').type(title)
  cy.get('[data-cy=note-content-input]').type(content)
  if (isPinned) {
    cy.get('[data-cy=pin-note-checkbox]').click()
  }
  cy.get('[data-cy=create-note-button]').click()
  // Vérifier que la note a été créée
  cy.contains(title).should('be.visible')
}) 