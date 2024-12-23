/// <reference types="cypress" />
import 'cypress-plugin-api'
import { user, UserBuilder } from '../../../utils/dataFactory.js'
const apiURL = 'https://thinking-tester-contact-list.herokuapp.com'

const contact1 = new UserBuilder().setDefaults().build()
const contact2 = new UserBuilder().setDefaults().build()
describe(
  'Cypress: thinking-tester-contact-list contacts API',
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
      let contactId = ''
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
      }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body.user).to.have.property('firstName', user.firstName)
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
    it(`POST create contact`, function () {
      cy.api({
        method: 'POST',
        url: apiURL + '/contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
          firstName: contact1.firstName,
          lastName: contact1.lastName,
          birthdate: contact1.dateOfBirth,
          email: contact1.email,
          phone: contact1.phoneNumber,
          street1: contact1.street,
          street2: '',
          city: contact1.city,
          stateProvince: contact1.state,
          postalCode: contact1.postalCode,
          country: contact1.country
        }
      }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('firstName', contact1.firstName)
        expect(response.body).to.have.property('lastName', contact1.lastName)
        expect(response.body).to.have.property('email', contact1.email)
        this.contactId = response.body._id
      })
    })
    it(`GET user contacts`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(1)
      })
    })
    it(`GET single contact`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', contact1.firstName)
        expect(response.body).to.have.property('lastName', contact1.lastName)
        expect(response.body).to.have.property('email', contact1.email)
        expect(response.body).to.have.property('phone', contact1.phoneNumber)
        expect(response.body).to.have.property('street1', contact1.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact1.city)
        expect(response.body).to.have.property('stateProvince', contact1.state)
        expect(response.body).to.have.property(
          'postalCode',
          contact1.postalCode
        )
        expect(response.body).to.have.property('country', contact1.country)
      })
    })
    it(`PUT update contact`, function () {
      cy.api({
        method: 'PUT',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
          firstName: contact2.firstName,
          lastName: contact2.lastName,
          email: contact2.email,
          phone: contact2.phoneNumber,
          street1: contact2.street,
          street2: '',
          city: contact2.city,
          stateProvince: contact2.state,
          postalCode: contact2.postalCode,
          country: contact2.country
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', contact2.firstName)
        expect(response.body).to.have.property('lastName', contact2.lastName)
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`GET contacts after update`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(1)
        expect(response.body[0]).to.have.property(
          'firstName',
          contact2.firstName
        )
        expect(response.body[0]).to.have.property('lastName', contact2.lastName)
        expect(response.body[0]).to.have.property('email', contact2.email)
        expect(response.body[0]).to.have.property('phone', contact2.phoneNumber)
        expect(response.body[0]).to.have.property('street1', contact2.street)
        expect(response.body[0]).to.have.property('street2', '')
        expect(response.body[0]).to.have.property('city', contact2.city)
        expect(response.body[0]).to.have.property(
          'stateProvince',
          contact2.state
        )
        expect(response.body[0]).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body[0]).to.have.property('country', contact2.country)
      })
    })
    it(`GET contact after update`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', contact2.firstName)
        expect(response.body).to.have.property('lastName', contact2.lastName)
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`PATCH contact`, function () {
      cy.api({
        method: 'PATCH',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        body: {
          firstName: 'Updated',
          lastName: 'Name',
          email: contact2.email,
          phone: contact2.phoneNumber
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', 'Updated')
        expect(response.body).to.have.property('lastName', 'Name')
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`GET contacts after patch`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(1)
        expect(response.body[0]).to.have.property('firstName', 'Updated')
        expect(response.body[0]).to.have.property('lastName', 'Name')
        expect(response.body[0]).to.have.property('email', contact2.email)
        expect(response.body[0]).to.have.property('phone', contact2.phoneNumber)
        expect(response.body[0]).to.have.property('street1', contact2.street)
        expect(response.body[0]).to.have.property('street2', '')
        expect(response.body[0]).to.have.property('city', contact2.city)
        expect(response.body[0]).to.have.property(
          'stateProvince',
          contact2.state
        )
        expect(response.body[0]).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body[0]).to.have.property('country', contact2.country)
      })
    })
    it(`GET contact after patch`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('firstName', 'Updated')
        expect(response.body).to.have.property('lastName', 'Name')
        expect(response.body).to.have.property('email', contact2.email)
        expect(response.body).to.have.property('phone', contact2.phoneNumber)
        expect(response.body).to.have.property('street1', contact2.street)
        expect(response.body).to.have.property('street2', '')
        expect(response.body).to.have.property('city', contact2.city)
        expect(response.body).to.have.property('stateProvince', contact2.state)
        expect(response.body).to.have.property(
          'postalCode',
          contact2.postalCode
        )
        expect(response.body).to.have.property('country', contact2.country)
      })
    })
    it(`DELETE contact`, function () {
      cy.api({
        method: 'DELETE',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
      })
    })
    it(`GET contacts after delete`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts',
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.eq(0)
      })
    })
    it(`GET contact after delete`, function () {
      cy.api({
        method: 'GET',
        url: apiURL + '/contacts/' + this.contactId,
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(404)
      })
    })
    it(`DELETE registered user`, function () {
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
