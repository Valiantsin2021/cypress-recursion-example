/// <reference types="cypress" />
describe('Crawl Bahmutov blog pages', () => {
  it('Visit every link from the repos list', () => {
    cy.viewport(1920, 1080)
    cy.visit('https://glebbahmutov.com/blog/index.html')
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    let height = 0
    const scrolltoBottom = async (window) => {
      if (height >= document.body.scrollHeight) {
        return
      }
      window.scrollTo(0, height)
      await delay(100)
      height += 100
      return scrolltoBottom(window)
    }
    cy.window().then(async (window) => {
      await scrolltoBottom(window)
    })
    cy.contains('a', 'Next ➡').as('nextPage')
    const links = []

    function crawl() {
      cy.get('[itemprop="name"] a')
        .should('have.length.greaterThan', 1)
        .then(($links) => {
          links.push(
            ...$links.toArray().map((link) => {
              const obj = {
                title: link.innerHTML,
                link: `https://glebbahmutov.com/blog/${link.getAttribute('href').replace('../../', '')}`
              }
              return obj
            })
          )
        })
      cy.contains('a', 'Next ➡')
        .should(() => {})
        .its('length')
        .then((length) => {
          if (length > 0) {
            cy.get('@nextPage').click().then(crawl)
          } else {
            cy.log('Last page clicked')
          }
        })
    }
    crawl()
    cy.wrap(links).then((links) => {
      cy.writeFile('links.json', links)
      console.log(JSON.stringify(links, null, 2))
    })
  })
})
