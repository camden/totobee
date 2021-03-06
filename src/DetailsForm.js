import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import firebase from 'firebase/app';
import { Firestore, Storage } from './firebase';
import ImageUpload from './ImageUpload';

import styles from './DetailsForm.scss';

class DetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSubmitting: false,
      position: null,
      timestamp: null,
      name: '',
      message: '',
      image: null,
      isDone: false,
    };
  }

  handleMessageChange = event => {
    const message = event.target.value;
    this.setState({ message });
  };

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

  renderGeneralSubtitle = () => {
    const name = this.props.selectedTotem.displayName;

    return (
      <>
        <p>
          Bring {name} on your next adventure, then leave it for another person
          to discover. Snap a picture of {name}’s new temporary home, and
          remember to upload it here! This photo along with your dream, name,
          and current location will become part of {name}’s travel history.
        </p>
        <p>
          Remember, just as dreams must move forward, so must Totobees. After
          four days, your Totobee’s energy will begin to wane. At this time, it
          needs to move on to help others find their dreams.
        </p>
      </>
    );
  };

  renderDescription = () => {
    const totobeeDescription = this.props.selectedTotem.description;

    if (!totobeeDescription) {
      return null;
    }

    return <p>{totobeeDescription}</p>;
  };

  submitForm = () => {
    const {
      name,
      message,
      position,
      timestamp,
      image: imageDataUrl,
    } = this.state;
    const totemCode = this.props.selectedTotem.code;
    this.setState({
      isSubmitting: true,
    });
    this.props
      .submitToFirebase({
        name,
        message,
        position,
        timestamp,
        imageDataUrl,
        totemCode,
      })
      .then(() => this.setState({ isDone: true, isSubmitting: false }));
  };

  render() {
    const { selectedTotem } = this.props;
    const { position, isDone, isLoading, isSubmitting } = this.state;

    if (isDone) {
      return <Redirect push to="/success" />;
    }

    let shareButtonText = 'Here we go! →';

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
        <h2 className={styles.title}>
          Your Totobee's name is{' '}
          <span className={styles.totobeeName}>
            {selectedTotem.displayName}
          </span>
          .
        </h2>
        <div className={styles.totobeeInfo}>
          {this.renderDescription()}
          {this.renderGeneralSubtitle()}
        </div>
        <label htmlFor="message">What is your dream?</label>
        <div>
          <textarea
            className={styles.dreamInput}
            id="message"
            name="message"
            type="text"
            rows={4}
            placeholder="What will bring you to happiness?"
            value={this.state.message}
            onChange={this.handleMessageChange}
          />
        </div>
        <label htmlFor="name">What is your name?</label>
        <input
          id="name"
          name="name"
          type="text"
          className={styles.nameInput}
          placeholder="What's your name?"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <label>
          Snap a picture of {selectedTotem.displayName} the Totobee in its new
          temporary dwelling!
        </label>
        <ImageUpload onImageChange={this.handleImageChange} />
        <label>
          We use your location to keep track of {selectedTotem.displayName} the
          Totobee's journey!
        </label>
        <div>
          <button
            onClick={this.getLocationAndTime}
            disabled={this.state.isLoading || position}
            className={`${styles.formButton} ${position && styles.buttonDone}`}
          >
            {locateButtonText}
          </button>
        </div>
        <div>
          <button
            className={styles.formButton}
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
      </div>
    );
  }
}

export default DetailsForm;
