describe('Main page test', () => {
  it('Test main dialog window', () => {
    cy.visit('/')
    cy.get('.desktop-dialog').should('be.visible')
    cy.get('.close-dialog').click()
    cy.get('.desktop-dialog').should('not.exist')
  })
})