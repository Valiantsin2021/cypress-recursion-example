/// <reference types="cypress" />
import 'cypress-ajv-schema-validator'
import 'cypress-plugin-api'
import { user } from '../../../utils/dataFactory.js'
const apiURL = 'https://thinking-tester-contact-list.herokuapp.com'
const registerUserSchema = require('../../fixtures/register_user_schema.json')
describe(
  'Cypress: thinking-tester-contact-list user API',
  {
    env: {
      hideCredentials: true,
      hideCredentialsOptions: {
        headers: ['Authorization'],
        auth: ['bearer'],
        body: ['password']
      }
    }
  },
  () => {
    before(() => {
      let token = ''
    })
    it(`POST register new user`, function () {
      cy.api({
        method: 'POST',
        url: apiURL + '/users',
        body: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password
        }
      })
        .validateSchema(registerUserSchema)
        .then(response => {
          expect(response.status).to.eq(201)
          expect(response.body.user).to.have.property(
            'firstName',
            user.firstName
          )
          expect(response.body.user).to.have.property('lastName', user.lastName)
          expect(response.body.user).to.have.property('email', user.email)
          this.token = response.body.token
        })
    })
    it(`POST login registered user`, function () {
      cy.api({
        method: 'POST',
        url: apiURL + '/users/login',
        body: {
          email: user.email,
          password: user.password
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.user).to.have.property('firstName', user.firstName)
        expect(response.body.user).to.have.property('lastName', user.lastName)
        expect(response.body.user).to.have.property('email', user.email)
        this.token = response.body.token
      })
    })
    it(`GET user profile`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        cy.log(response.body)
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', user.firstName)
        expect(response.body).to.have.property('lastName', user.lastName)
        expect(response.body).to.have.property('email', user.email)
      })
    })
    it(`PATCH update user profile`, function () {
      cy.api({
        method: 'PATCH',
        url: apiURL + '/users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
          firstName: 'Updated',
          lastName: 'Username',
          email: user.email,
          password: 'myNewPassword'
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', 'Updated')
        expect(response.body).to.have.property('lastName', 'Username')
        expect(response.body).to.have.property('email', user.email)
      })
    })
    it(`POST logout user`, function () {
      cy.api({
        method: 'POST',
        url: apiURL + '/users/logout',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    })
    it(`GET user profile after logout`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(401)
      })
    })
    it(`POST login and get updated user`, function () {
      cy.api({
        method: 'POST',
        url: apiURL + '/users/login',
        body: {
          email: user.email,
          password: 'myNewPassword'
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.user).to.have.property('firstName', 'Updated')
        expect(response.body.user).to.have.property('lastName', 'Username')
        expect(response.body.user).to.have.property('email', user.email)
        this.token = response.body.token
      })
    })
    it(`DELETE user`, function () {
      cy.api({
        method: 'DELETE',
        url: apiURL + '/users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    })
    it(`GET user profile after delete`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/users/me',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(401)
      })
    })
  }
)
