/// <reference types="cypress" />

describe('Swaglab Store', () => {
  it(`should be able to login`, function () {
    cy.visit('/')
    cy.fixture('user').then((user) => {
      cy.getBySel('username').type(user.name)
      cy.getBySel('password').type(user.pass)
      cy.getBySel('login-button').click()
      cy.contains('Swag Labs').should('be.visible')
      cy.getBySel('inventory-item-description').should('have.length', 6).and('be.visible')

      cy.getBySel('inventory-item-name').should('have.length', 6).and('be.visible').each((item, i) => {
        for (let el of user.items) {
          cy.wrap(item[i]).invoke('text').should('eq', el)
        }
      })
    })
  })
})
