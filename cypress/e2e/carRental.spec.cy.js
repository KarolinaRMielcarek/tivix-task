import data from "../fixtures/data.json";
describe("Check the rental flow", () => {
  beforeEach(() => {
    //Given('I open the Car Rental page and I enter coutry and city of the rent and model of the car)
    cy.visit("http://qalab.pl.tivixlabs.com/");
    cy.get("#country").select(data.country);
    cy.get("#city").select(data.city);
    cy.get("#model").type(data.model);
  });
  it("Should rent a car", () => {
    //And('I select dates of pick-up and drop-off of the car)
    cy.get("#pickup").type(data.pickup);
    cy.get("#dropoff").type(data.dropoff);
    cy.get(".btn-primary").click();
    //When('I search in available cars and choose one, then I enter personal data, card number and email')
    cy.get("#search-results>tbody>tr:nth-child(3)>td:nth-child(7)>a").click();
    cy.get(".btn-primary").click();
    cy.get("#name").type("Testname");
    cy.get("#last_name").type("Testlastname");
    cy.get("#card_number").type("4242424242424242");
    cy.get("#email").type("testemail@test.com");
    //Then('I check the response code of the request and make a rental successfully')
    cy.intercept("POST", "http://qalab.pl.tivixlabs.com/rent/*").as(
      "response"
    );
    cy.get(".btn-primary").click();
    cy.wait("@response").its("response.statusCode").should("eq", 200);
  });

  it("Should require rental dates", () => {
    //And('I select dates of pick-up and drop-off of the car)
    cy.get("#pickup").type(data.pickup);
    cy.get("#dropoff").type(data.dropoff);
    cy.get(".btn-primary").click();
    //When('I clear the dates')
    cy.get("#pickup").clear();
    cy.get("#dropoff").clear();
    cy.get(".btn-primary").click();
    //Then('I check if the alert is visible and I cannot go further without selecting dates')
    cy.get(".alert-danger").should(
      "have.text",
      "Please fill pickup and drop off dates"
    );
  });

  it("Should check the validation of fields", () => {
    //And('I select dates of pick-up and drop-off of the car)
    cy.get("#pickup").type(data.pickup);
    cy.get("#dropoff").type(data.dropoff);
    cy.get(".btn-primary").click();
    //When('I search in available cars and choose one and I want to go further without entering personal data, card number and email)
    cy.get("#search-results>tbody>tr:nth-child(3)>td:nth-child(7)>a").click();
    cy.get(".btn-primary").click();
    cy.get(".btn-primary").click();
    //Then('I check if the validation alerts are visible and I am unable to make a rental')
    cy.get("#rent_form>h5:nth-child(1)").should(
      "have.text",
      "Name is required"
    );
    cy.get("#rent_form>h5:nth-child(2)").should(
      "have.text",
      "Last name is required"
    );
    cy.get("#rent_form>h5:nth-child(3)").should(
      "have.text",
      "Email is required"
    );
    cy.get("#rent_form>h5:nth-child(4)").should(
      "have.text",
      "Card number is required"
    );
    //When('I enter personal data, card number and email which are inconsistent with validation rules')
    cy.get("#name").type(data.invalidData);
    cy.get("#last_name").type(data.invalidData);
    cy.get("#card_number").type(data.invalidData);
    cy.get("#email").type(data.invalidData);
    cy.get(".btn-primary").click();
    //Then('I check if the validation alerts are visible and I am unable to make a rental')
    cy.get("#rent_form>h5:nth-child(1)").should(
      "have.text",
      "Name value is too long"
    );
    cy.get("#rent_form>h5:nth-child(2)").should(
      "have.text",
      "Last name value is too long"
    );
    cy.get("#rent_form>h5:nth-child(3)").should(
      "have.text",
      "Please provide valid email"
    );
    cy.get("#rent_form>h5:nth-child(4)").should(
      "have.text",
      "Card number value is too long"
    );
  });
});
