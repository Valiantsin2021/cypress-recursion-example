/// <reference types="cypress" />
import { user } from '../../../utils/dataFactory.js'
import { createUser } from '../../support/api-objects/requests-spok.js'

it(`create user with API object and spok library`, () => {
  createUser('/users', {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password
  })
})
