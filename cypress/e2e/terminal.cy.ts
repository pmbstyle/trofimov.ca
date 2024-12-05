import "cypress-real-events";

describe("Terminal functionality spec", () => {
  const terminalInputSelector = "#termInput";
  const outputSelector = ".history-output";

  beforeEach(() => {
    cy.visit("/");
    cy.get(".item-terminal").should("be.visible").click();
  });

  it("opens the terminal", () => {
    cy.get(".terminal-wrapper").should("be.visible");
  });

  it("executes the ls command and checks the output", () => {
    const expectedFiles = [
      "projects",
      "about.md",
      "skills.md",
      "contact.md",
      "experience.md",
    ];
    cy.get(terminalInputSelector).type("ls{enter}");
    expectedFiles.forEach((file, index) => {
      cy.get(`${outputSelector}-grid .history-output-grid-item p`)
        .eq(index)
        .should("have.text", file);
    });
  });

  it("changes directory with the cd command", () => {
    const expectedPath = "~/projects";
    cy.get(terminalInputSelector).type("cd projects{enter}");
    cy.get(
      ".terminal > .ps > .command-container .command-prefix .user-path"
    ).should("have.text", expectedPath);
  });

  it("clears the terminal with the clear command", () => {
    cy.get(terminalInputSelector).type("clear{enter}");
    cy.get(".term-header").should("not.exist");
  });

  it("displays the current directory with pwd command", () => {
    const expectedPath = "/home/user";
    cy.get(terminalInputSelector).type("pwd{enter}");
    cy.get(`${outputSelector}.markdown-content`).should(
      "have.text",
      expectedPath
    );
  });

  it("shows help with the help command", () => {
    cy.get(terminalInputSelector).type("help{enter}");
    cy.get(`${outputSelector}.markdown-content ul`).should("not.be.empty");
  });

  it("reads file content with the cat command", () => {
    cy.get(terminalInputSelector).type("cat about.md{enter}");
    cy.get(`${outputSelector}.markdown-content`).should("not.be.empty");
  });

  it("autocompletes with the tab key", () => {
    cy.get(terminalInputSelector).type("cat a");
    cy.realPress("Tab");
    cy.get(terminalInputSelector).should("have.value", "cat about.md");
  });

  it("closes the terminal", () => {
    cy.get(".close-window").click();
    cy.get(".terminal-wrapper").should("not.exist");
  });
});
