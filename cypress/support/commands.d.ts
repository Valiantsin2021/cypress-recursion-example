declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to open get element by data-cy attribute
     * @example cy.getCy('hello')
     * @param {string} attr - data-cy attribute
     */
    getBySel(attr)
  }
}
