import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import firebase from 'firebase/app';
import { Firestore, Storage } from './firebase';
import ImageUpload from './ImageUpload';

import styles from './DetailsForm.scss';
import SignIn from './SignIn';

class DetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSubmitting: false,
      position: null,
      timestamp: null,
      name: '',
      image: null,
      isDone: false,
      isAuthenticated: false,
    };
  }

  handleNameChange = event => {
    const name = event.target.value;
    this.setState({ name });
  };

  handleImageChange = imageURL => {
    this.setState(state => ({
      ...state,
      image: imageURL,
    }));
  };

  getLocationAndTime = () => {
    return new Promise((resolve, reject) => {
      this.setState({ isLoading: true });
      return navigator.geolocation.getCurrentPosition(
        info =>
          this.setState(state => {
            return {
              ...state,
              isLoading: false,
              position: info.coords,
              timestamp: info.timestamp,
            };
          }),
        error => {
          alert(
            "Error: you haven't granted us permission to use your location."
          );
          this.setState(state => {
            return {
              ...state,
              isLoading: false,
            };
          });
        },
        { timeout: 10000 }
      );
    });
  };

  submitForm = () => {
    const { name, position, timestamp, image: imageDataUrl } = this.state;
    const totemCode = this.props.selectedTotem.code;
    this.setState({
      isSubmitting: true,
    });
    this.props
      .submitToFirebase({
        name,
        position,
        timestamp,
        imageDataUrl,
        totemCode,
      })
      .then(() => this.setState({ isDone: true, isSubmitting: false }));
  };

  handleSignInSuccess = () => {
    this.setState({
      isAuthenticated: true,
    });
  };

  render() {
    const {
      position,
      isDone,
      isLoading,
      isSubmitting,
      isAuthenticated,
    } = this.state;
    const { selectedTotem } = this.props;

    if (isDone) {
      return <Redirect push to="/success" />;
    }

    let shareButtonText = 'Share →';

    if (isSubmitting) {
      shareButtonText = 'Loading...';
    }

    let locateButtonText = 'Locate me!';

    if (isLoading) {
      locateButtonText = 'Loading...';
    }

    if (position) {
      locateButtonText = 'Found you! ✓';
    }

    return (
      <div className={styles.container}>
        <h1>
          Your Piff's name is{' '}
          <span className={styles.piffName}>{selectedTotem.displayName}</span>.
        </h1>
        <label htmlFor="name">Your Name:</label>
        <input
          name="name"
          type="text"
          placeholder="What's your name?"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        {this.state.isAuthenticated ? null : (
          <div style={{ marginTop: '30px' }}>
            <label>Sign in with Google to upload pictures.</label>
            <SignIn onSignInSuccess={this.handleSignInSuccess} />
          </div>
        )}
        <ImageUpload
          onImageChange={this.handleImageChange}
          isAuthenticated={isAuthenticated}
        />
        <button
          onClick={this.getLocationAndTime}
          disabled={this.state.isLoading || position}
          className={position && styles.buttonDone}
        >
          {locateButtonText}
        </button>
        <button
          onClick={this.submitForm}
          disabled={
            isSubmitting ||
            !(
              this.state.position &&
              this.state.timestamp &&
              this.state.name &&
              this.state.image
            )
          }
        >
          {shareButtonText}
        </button>
      </div>
    );
  }
}

export default DetailsForm;
