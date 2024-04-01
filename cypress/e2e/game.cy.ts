describe("Game", () => {
  it("Tests game window", () => {
    cy.visit("/")
    cy.get("div.item-game > div.icon").click()
    cy.get("div.close-window").click()
    cy.get("div.game").should("not.exist")
  })
})
