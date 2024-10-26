import spok from 'cy-spok'
import 'dotenv/config'
// const apiURL = process.env.BASE_URL
const apiURL = 'https://thinking-tester-contact-list.herokuapp.com'
export const checkAPIStatus = (
  endpoint,
  expectedBody,
  expectedStatus = 200
) => {
  cy.api({
    url: apiURL + endpoint,
    method: 'GET',
    failOnStatusCode: false
  }).should(
    spok({
      status: expectedStatus,
      body: expectedBody
    })
  )
}
export const createUser = (endpoint, payload, expectedStatus = 201) => {
  cy.api({
    url: apiURL + endpoint,
    method: 'POST',
    failOnStatusCode: false,
    body: payload
  })
    .as('createUser')
    .should(
      spok({
        status: expectedStatus,
        body: {
          user: {
            _id: spok.string,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            __v: spok.number
          }
        }
      })
    )
    .then(response => {
      Cypress.env('token', response.body.token)
    })
}

export const loginUser = (endpoint, payload, expectedStatus = 200) => {
  cy.api({
    url: apiURL + endpoint,
    method: 'POST',
    failOnStatusCode: false,
    body: payload
  })
    .should(
      spok({
        status: expectedStatus,
        body: {
          user: {
            firstName: payload.user.firstName,
            lastName: payload.user.lastName,
            email: payload.user.email
          },
          token: spok.string
        }
      })
    )
    .then(response => {
      Cypress.env('token', response.body.token)
    })
}
