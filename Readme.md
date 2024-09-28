## Example scripts in Cypress to:

-  recurse on page scroll and pagination
-  check the available links not broken

To run tests with recursion:

Install the dependencies with 

```bash
npm install
```

Run tests with:

```bash
npx cypress run --spec cypress/e2e/crawl.cy.js
```

To run tests with links check:
```bash
npx cypress run --spec cypress/e2e/parabank.cy.js
```