import "cypress-real-events"
describe('Terminal fn spec', () => {
  const openTerminal = () => {
    cy.visit('/')
    let terminal = cy.get('.item-terminal')
    terminal.should('be.visible')
    terminal.click()
  }
  
  const checkTerminalOutput = (input: string, outputItems: string[], outputType: string) => {
    let terminalInput = cy.get('#termInput')
    terminalInput.type(input).type('{enter}')
    if(outputType === 'list') {
      let terminalOutput = cy.get('.history-item').last()
      terminalOutput.get('.history-output-grid .history-output-grid-item p').each(($el, index) => {
        cy.wrap($el).should('have.text', outputItems[index])
      })
    }
    if(outputType === 'cd') {
      let userPath = cy.get('.terminal > .ps > .command-container .command-prefix .user-path')
      userPath.should('have.text', outputItems[0])
    }
    if(outputType === 'help' || outputType === 'cat') {
      let terminalOutput = cy.get('.history-output.markdown-content')
      terminalOutput.get('ul').should('not.be.empty')
    }
    if(outputType === 'clear') {
      cy.get('.term-header').should('not.exist')
    }
    if(outputType === 'pwd') {
      let terminalOutput = cy.get('.history-output.markdown-content')
      terminalOutput.should('have.text', outputItems[0])
    }
  }

  const runTest = (test) => {
    switch(test) {
      case 'open':
        it('Terminal opens', () => {
          openTerminal()
          cy.get('.terminal-wrapper').should('be.visible')
        })
        break
      case 'help':
        it('Command: help', () => {
          openTerminal()
          checkTerminalOutput('help', [], '')
        })
        break
      case 'ls':
        it('Command: ls', () => {
          openTerminal()
          checkTerminalOutput('ls', ['projects', 'about.md', 'skills.md', 'contact.md', 'experience.md'], 'list')
        })
        break
      case 'cd':
        it('Command: cd', () => {
          openTerminal()
          checkTerminalOutput('cd projects', ['~/projects'], 'cd')
        })
        break
      case 'clear':
        it('Command: clear', () => {
          openTerminal()
          checkTerminalOutput('clear', [''], 'clear')
        })
        break
      case 'pwd':
        it('Command: pwd', () => {
          openTerminal()
          checkTerminalOutput('pwd', ['/home/user'], 'pwd')
        })
        break
      case 'cat':
        it('Command: cat', () => {
          openTerminal()
          checkTerminalOutput('cat about.md', [''], 'cat')
        })
        break
      case 'tab':
        it('Action: tab', () => {
          openTerminal()
          cy.get('#termInput').type('cat a')
          cy.realPress("Tab")
          cy.get('#termInput').should('have.value', 'cat about.md')
        })
        break
      case 'close':
        it('Terminal closes', () => {
          openTerminal()
          cy.get('.close-window').click()
          cy.get('.terminal-wrapper').should('not.exist')
        })
        break
      default:
        break
    }
  }

  let tests = ['open', 'close', 'help', 'ls', 'cd', 'clear', 'pwd', 'cat', 'tab']
  tests.forEach((test) => {
    runTest(test)
  })
})