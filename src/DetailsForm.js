import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import firebase from 'firebase/app';
import { Firestore, Storage } from './firebase';
import ImageUpload from './ImageUpload';

import styles from './LogDetails.scss';

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

    return (
      <div>
        {this.state.loading ? <div>Loading!</div> : null}
        <h1>Where's {selectedTotem.displayName}?</h1>
        <h2>To log your find, we need some info from you!</h2>
        <label htmlFor="name">Your Name: </label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <ImageUpload onImageChange={this.handleImageChange} />
        <button onClick={this.getLocationAndTime}>Get Location</button>
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
