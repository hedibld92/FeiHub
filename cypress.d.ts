declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('email', 'password')
     */
    login(email: string, password: string): Chainable<Element>

    /**
     * Custom command to create a task
     * @example cy.createTask({ title: 'Test', description: 'Description', priority: 'medium' })
     */
    createTask(options: { title: string; description: string; priority?: string }): Chainable<Element>

    /**
     * Custom command to create a note
     * @example cy.createNote({ title: 'Test', content: 'Content', isPinned: false })
     */
    createNote(options: { title: string; content: string; isPinned?: boolean }): Chainable<Element>
  }
} 