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
      loading: false,
      position: null,
      timestamp: null,
      name: '',
      image: null,
      isDone: false,
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
      this.setState({ loading: true });
      return navigator.geolocation.getCurrentPosition(info =>
        this.setState(state => {
          return {
            ...state,
            loading: false,
            position: info.coords,
            timestamp: info.timestamp,
          };
        })
      );
    });
  };

  submitForm = () => {
    const { name, position, timestamp, image: imageDataUrl } = this.state;
    const totemCode = this.props.selectedTotem.code;
    this.props
      .submitToFirebase({
        name,
        position,
        timestamp,
        imageDataUrl,
        totemCode,
      })
      .then(() => this.setState({ isDone: true }));
  };

  render() {
    const { position, isDone } = this.state;
    const { selectedTotem } = this.props;

    if (isDone) {
      return <Redirect push to="/success" />;
    }

    const locateButtonText = this.state.loading ? 'Loading...' : 'Locate me!';

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
        <ImageUpload onImageChange={this.handleImageChange} />
        <button onClick={this.getLocationAndTime} disabled={this.state.loading}>
          {locateButtonText}
        </button>
        <div>
          Position: {position && position.latitude} x{' '}
          {position && position.longitude}
        </div>
        <div>Timestamp: {this.state.timestamp}</div>

        <button
          onClick={this.submitForm}
          disabled={
            !(
              this.state.position &&
              this.state.timestamp &&
              this.state.name &&
              this.state.image
            )
          }
        >
          Submit
        </button>
      </div>
    );
  }
}

export default DetailsForm;
