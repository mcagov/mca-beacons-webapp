import { givenIDoNotHaveAValidSession } from "../common/selectors-and-assertions.spec";

describe("Your beacon registry account", () => {
  it("Redirects the user to the sign up or sign in page if the user does not have a valid session", () => {
    givenIDoNotHaveAValidSession();
    cy.visit("/account/your-beacon-registry-account");
    cy.url().should("eq", "http://localhost:3000/account/sign-up-or-sign-in");
  });
});
