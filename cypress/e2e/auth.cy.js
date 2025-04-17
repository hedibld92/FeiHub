describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('affiche le formulaire de connexion', () => {
    cy.get('h2').should('contain', 'Fei.Hub')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('affiche une erreur avec des identifiants invalides', () => {
    cy.get('input[type="email"]').type('test@invalid.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.get('.text-red-500').should('be.visible')
  })

  it('redirige vers le dashboard après une connexion réussie', () => {
    cy.get('input[type="email"]').type(Cypress.env('USER_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('USER_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
}) 