describe('Kanban Board', () => {
  beforeEach(() => {
    // Login before each test
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'))
    cy.visit('/kanban')
  })

  it('affiche correctement la structure du Kanban', () => {
    // Vérifier les colonnes
    cy.contains('h3', 'À faire').should('be.visible')
    cy.contains('h3', 'En cours').should('be.visible')
    cy.contains('h3', 'Terminé').should('be.visible')

    // Vérifier le bouton de création
    cy.get('[data-cy=new-task-button]').should('be.visible')
  })

  it('peut créer une nouvelle tâche avec tous les champs', () => {
    const taskTitle = `Test Task ${Date.now()}`
    
    // Créer une tâche
    cy.createTask({
      title: taskTitle,
      description: 'Description détaillée de la tâche de test',
      priority: 'high'
    })

    // Vérifier que la tâche est dans la colonne "À faire"
    cy.contains('.flex-1', 'À faire')
      .should('contain', taskTitle)
      .and('contain', 'high')
  })

  it('peut modifier une tâche existante', () => {
    const taskTitle = `Task to Edit ${Date.now()}`
    const newTitle = 'Task Updated'
    
    // Créer une tâche d'abord
    cy.createTask({
      title: taskTitle,
      description: 'Cette tâche sera modifiée',
      priority: 'low'
    })

    // Modifier la tâche
    cy.contains(taskTitle).parent().find('[data-cy=edit-task-button]').click()
    cy.get('[data-cy=task-title-input]').clear().type(newTitle)
    cy.get('[data-cy=task-description-input]').clear().type('Description mise à jour')
    cy.get('[data-cy=priority-high]').click()
    cy.get('[data-cy=save-task-button]').click()

    // Vérifier les modifications
    cy.contains(newTitle).should('be.visible')
    cy.contains('high').should('be.visible')
  })

  it('peut supprimer une tâche', () => {
    const taskTitle = `Task to Delete ${Date.now()}`
    
    // Créer une tâche
    cy.createTask({
      title: taskTitle,
      description: 'Cette tâche sera supprimée',
      priority: 'medium'
    })

    // Supprimer la tâche
    cy.contains(taskTitle).parent().find('[data-cy=delete-task-button]').click()
    cy.get('[data-cy=confirm-delete-button]').click()

    // Vérifier que la tâche n'existe plus
    cy.contains(taskTitle).should('not.exist')
  })

  it('peut déplacer une tâche entre les colonnes', () => {
    const taskTitle = `Draggable Task ${Date.now()}`
    
    // Créer une tâche
    cy.createTask({
      title: taskTitle,
      description: 'Cette tâche sera déplacée',
      priority: 'medium'
    })

    // Simuler le drag & drop de "À faire" vers "En cours"
    cy.contains(taskTitle)
      .parent()
      .trigger('dragstart')
    cy.contains('h3', 'En cours')
      .parent()
      .trigger('drop')

    // Vérifier que la tâche est dans la nouvelle colonne
    cy.contains('.flex-1', 'En cours')
      .should('contain', taskTitle)
  })

  it('affiche correctement les priorités avec leurs couleurs', () => {
    // Créer trois tâches avec différentes priorités
    cy.createTask({
      title: 'Tâche priorité haute',
      description: 'Test priorité haute',
      priority: 'high'
    })

    cy.createTask({
      title: 'Tâche priorité moyenne',
      description: 'Test priorité moyenne',
      priority: 'medium'
    })

    cy.createTask({
      title: 'Tâche priorité basse',
      description: 'Test priorité basse',
      priority: 'low'
    })

    // Vérifier les couleurs des badges de priorité
    cy.contains('high').should('have.class', 'bg-error')
    cy.contains('medium').should('have.class', 'bg-warning')
    cy.contains('low').should('have.class', 'bg-success')
  })
}) 