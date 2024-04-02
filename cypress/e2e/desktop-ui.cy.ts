describe('Small projects interaction', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Clock should display the current time in the correct format', () => {
    cy.wait(2000) // Wait for the clock to update

    const now = new Date()
    const hours = now.getHours() % 12 || 12
    const minutes = now.getMinutes()
    const ampm = now.getHours() >= 12 ? 'pm' : 'am'
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`

    cy.get('.clock').invoke('text').then((text) => {
      expect(text.trim()).to.contain(formattedTime)
    })
  })

  it('Should display and hide the folder content correctly', () => {
    cy.get('.item-projects-folder').should('be.visible').as('ProjectsFolder')
    cy.get('@ProjectsFolder').click()
    cy.get('.folder').should('be.visible').as('Folder')
    cy.get('.desktop').click('center')
    cy.get('@Folder').should('not.be.visible')
  })

  it('Test main dialog window', () => {
    cy.get('.desktop-dialog').should('be.visible')
    cy.get('.close-dialog').click()
    cy.get('.desktop-dialog').should('not.exist')
  })
})
