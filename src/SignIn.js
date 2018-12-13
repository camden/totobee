import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Firebase as firebase } from './firebase';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.uiConfig = {
      signInFlow: 'popup',
      signInOptions: [],
      callbacks: {
        signInSuccessWithAuthResult: this.signInSuccessful,
      },
    };
  }

  signInSuccessful = () => {
    this.props.onSignInSuccess();
  };

  signIn() {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => console.log('authd!'))
      .catch(err => console.log(err));
  }

  render() {
    return <div onClick={this.signIn}>Sign in by clicking here</div>;
    return (
      <StyledFirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
      />
    );
  }
}
export default SignIn;
