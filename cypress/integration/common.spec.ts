import { v4 as uuidv4 } from "uuid";

export const requiredFieldErrorMessage = "required field";
export const tooManyCharactersErrorMessage = "too many characters";
export const mustBeAnIntegerErrorMessage = "must be a whole number";

export const andICanClickTheBackLinkToGoToPreviousPage = (
  previousPageURL: string
): void => {
  cy.get(".govuk-back-link").click();
  thenTheUrlShouldContain(previousPageURL);
};

export const givenIAmAt = (url: string): void => {
  cy.setCookie("submissionId", uuidv4());
  cy.visit(url);
};

export const whenIClickContinue = (): void => {
  cy.get("button").contains("Continue").click();
};

export const whenIClickOnTheErrorSummaryLinkContainingText = (
  ...strings: string[]
): void => {
  let link = cy.get(".govuk-error-summary__list");
  strings.forEach((string) => (link = link.contains(string)));
  link.click();
};

export const whenIType = (value: string, inputName: string): void => {
  cy.get(`input[name="${inputName}"]`).clear().type(value);
};

export const thenTheUrlShouldContain = (urlPath: string): void => {
  cy.url().should("include", urlPath);
};

export const thenTheInputShouldContain = (
  expectedValue: string,
  inputName: string
): void => {
  cy.get(`input[name="${inputName}"]`).should("contain.value", expectedValue);
};

export const thenIShouldSeeAnErrorSummaryLinkThatContains = (
  ...strings: string[]
): void => {
  cy.get(".govuk-error-summary__list").within(() => {
    strings.every((string) => cy.get("a").should("contain", string));
  });
};

export const thenIShouldSeeAnErrorMessageThatContains = (
  ...strings: string[]
): void => {
  strings.every((string) =>
    cy.get(".govuk-error-message").should("contain", string)
  );
};

export const thenMyFocusMovesTo = (elementId: string): void => {
  cy.focused().should("have.attr", "id", elementId);
};

export const givenIHaveSelected = (optionId: string): void => {
  cy.get(optionId).click();
};
