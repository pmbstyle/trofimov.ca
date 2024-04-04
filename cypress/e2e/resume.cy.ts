describe("Resume", () => {
  it("Tests resume window", () => {
    cy.visit("/")
    cy.get("div.item-resume > div.icon").click()
    cy.get("article h1").should("include.text", "Slava Trofimov")
    cy.get("div.close-window").click()
    cy.get("div.mockup-window").should("not.exist")
  })
})
