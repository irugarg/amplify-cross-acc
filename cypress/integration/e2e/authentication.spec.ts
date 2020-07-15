import { first } from 'cypress/types/lodash';

export const selectors = {
  usernameInput: '[data-test="sign-in-username-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-test="sign-out-button"]',
};

describe('Authenticator:', () => {
  // Step 1: setup the application state
  beforeEach(() => {
    cy.visit('/');
    // Auth component classes//*[@id="root"]/amplify-authenticator/div[1]/amplify-sign-in//amplify-form-section/div/slot/slot[2]/amplify-button
  });

  describe('Sign In:', () => {
    it('should fail with dummy data', () => {
      // Step 2: Take an action (Sign in)
      cy.get(selectors.usernameInput, { includeShadowDom: true })
        .first()
        .type('DUMMY_USERNAME', { force: true });

      cy.get(selectors.signInPasswordInput, { includeShadowDom: true })
        .first()
        .type('DUMMY_PASSWORD', { force: true });

      cy.get(selectors.signInSignInButton, { includeShadowDom: true })
        .contains('Sign In')
        .click();

      // // Step 3: Make an assertion (Check for sign-out text)
      cy.get('.toast', {
        includeShadowDom: true,
      }).contains('User does not exist.');
    });
  });

  // When a user is created in first time, you can apply the code below for testing purposes.
  // describe('Sign In with real data:', () => {
  //   it('allows a user to signin', () => {
  //     // Step 2: Take an action (Sign in)
  //     cy.get(selectors.usernameInput, { includeShadowDom: true })
  //       .first()
  //       .type('okuhamail@gmail.com', { force: true });

  //     cy.get(selectors.signInPasswordInput, { includeShadowDom: true })
  //       .first()
  //       .type('123456789', { force: true });

  //     cy.get(selectors.signInSignInButton, { includeShadowDom: true })
  //       .contains('Sign In')
  //       .click();

  //     // Step 3: Make an assertion (Check for profile text)
  //     cy.get('#profile', {
  //       includeShadowDom: true,
  //     })
  //       .wait(500)
  //       .contains('My Profile');
  //   });
  // });
});
