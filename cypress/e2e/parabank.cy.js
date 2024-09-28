/// <reference types="cypress" />

describe('Swaglab Store', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
  })
  it(`should verify all links on Home page`, function () {
    cy.get('a').then(items => {
      const links = Cypress._.map(items, 'href')
      const urls = links.filter(el => !el.match(/mailto/))
      for (let url of urls) {
        cy.request(url).its('status').should('eq', 200)
      }
    })
  })
})
