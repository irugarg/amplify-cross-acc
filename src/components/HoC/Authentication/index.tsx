import React, { useState, useEffect, useContext } from 'react';

import {
  AmplifyForgotPassword,
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
  AmplifyConfirmSignUp,
} from '@aws-amplify/ui-react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Container } from './styles';
import { AuthContext } from '../../../hooks/AuthContext';

const AuthComponent: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState();
  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    if (authState === 'signedin') {
      signIn();
    }
    if (authState === 'signout') {
      signIn();
    }
    return onAuthUIStateChange((newAuthState) => {
      setAuthState(newAuthState);
      console.log(newAuthState);
    });
  }, [authState, signIn]);

  return (
    <AmplifyAuthenticator>
      {/* Sign In */}
      <Container
        slot="sign-in"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AmplifySignIn />
      </Container>

      {/* Sign Up */}
      <Container
        slot="sign-up"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AmplifySignUp
          usernameAlias="email"
          formFields={[
            {
              type: 'email',
              label: 'Email',
              placeholder: 'Enter your email',
              required: true,
            },
            {
              type: 'password',
              label: 'Password',
              placeholder: 'Enter your password',
              required: true,
            },
          ]}
        />
      </Container>
      <Container
        slot="confirm-sign-in"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      />

      {/* Forgot Password */}
      <Container
        slot="forgot-password"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AmplifyForgotPassword />
      </Container>

      {/* Confirm Sign Up */}
      <Container
        slot="confirm-sign-up"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AmplifyConfirmSignUp />
      </Container>
      {children}
    </AmplifyAuthenticator>
  );
};

export default AuthComponent;
