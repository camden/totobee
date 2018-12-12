import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Firebase as firebase } from './firebase';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.uiConfig = {
      signInFlow: 'popup',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: this.signInSuccessful,
      },
    };
  }

  signInSuccessful = () => {
    this.props.onSignInSuccess();
  };

  render() {
    return (
      <StyledFirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
      />
    );
  }
}
export default SignIn;
