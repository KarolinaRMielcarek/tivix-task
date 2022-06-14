import data from '../fixtures/data.json'
describe ('Check the rental flow', () => {
    beforeEach(() => {
        //Given
        cy.visit('http://qalab.pl.tivixlabs.com/')
        cy.get('#country').select(data.country)
        cy.get('#city').select(data.city)
        cy.get('#model').type(data.model)
    })
    it('Should rent a car', () => {
        //Given
        cy.get('#pickup').type(data.pickup)
        cy.get('#dropoff').type(data.dropoff)
        cy.get('.btn-primary').click()
        //When
        cy.get('#search-results>tbody>tr:nth-child(3)>td:nth-child(7)>a').click()

        cy.get('.btn-primary').click()
        cy.get('#name').type('Testname')
        cy.get('#last_name').type('Testlastname')
        cy.get('#card_number').type('4242424242424242')
        cy.get('#email').type('testemail@test.com')
    
        //Then
        cy.intercept('POST', 'http://qalab.pl.tivixlabs.com/rent/10').as('response')
        cy.get('.btn-primary').click()
        cy.wait('@response').its('response.statusCode').should('eq', 200)
    })

    it('Should require rental dates', () => {
        //Given
        cy.get('#pickup').type(data.pickup)
        cy.get('#dropoff').type(data.dropoff)
        cy.get('.btn-primary').click()
        //When
        cy.get('#pickup').clear()
        cy.get('#dropoff').clear()
        cy.get('.btn-primary').click()
        //Then
        cy.get('.alert-danger').should('have.text', 'Please fill pickup and drop off dates')
    })

        it('Should check the validation of fields', () => {
            //Given
            cy.get('#pickup').type(data.pickup)
            cy.get('#dropoff').type(data.dropoff)
            cy.get('.btn-primary').click()
            //When
            cy.get('#search-results>tbody>tr:nth-child(3)>td:nth-child(7)>a').click()
            
            cy.get('.btn-primary').click()

            cy.get('.btn-primary').click()
            //Then
            cy.get('#rent_form>h5:nth-child(1)').should('have.text', 'Name is required')
            cy.get('#rent_form>h5:nth-child(2)').should('have.text', 'Last name is required')
            cy.get('#rent_form>h5:nth-child(3)').should('have.text', 'Email is required')
            cy.get('#rent_form>h5:nth-child(4)').should('have.text', 'Card number is required')
            //When
            cy.get('#name').type(data.invalidData)
            cy.get('#last_name').type(data.invalidData)
            cy.get('#card_number').type(data.invalidData)
            cy.get('#email').type(data.invalidData)
            cy.get('.btn-primary').click()
            //Then
            cy.get('#rent_form>h5:nth-child(1)').should('have.text', 'Name value is too long')
            cy.get('#rent_form>h5:nth-child(2)').should('have.text', 'Last name value is too long')
            cy.get('#rent_form>h5:nth-child(3)').should('have.text', 'Please provide valid email')
            cy.get('#rent_form>h5:nth-child(4)').should('have.text', 'Card number value is too long')
        })
    })