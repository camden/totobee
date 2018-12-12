import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import firebase from 'firebase/app';
import { Firestore, Storage } from './firebase';
import ImageUpload from './ImageUpload';
import DetailsForm from './DetailsForm';

class LogDetails extends React.Component {
  getTotemCode = () => {
    const query = this.props.location.search;
    const parsed = QueryString.parse(query);
    return parsed.code;
  };

  getImageRef(imageUrl) {
    const version = 'caesar';
    const imageName = 'img2.jpg';
    const imageStorageRef = Storage.child(`images/${version}/${imageName}`);
    return imageStorageRef;
  }

  uploadImageToFirebase(imageUrl) {
    return new Promise((resolve, reject) => {
      return this.getImageRef(imageUrl)
        .putString(imageUrl, 'data_url')
        .then(snapshot => {
          resolve(snapshot);
        })
        .catch(reject);
    });
  }

  uploadMetadata({ name, position, timestamp, imageUrl, totemCode }) {
    return Firestore.collection('visits')
      .add({
        imageUrl,
        name,
        totemCode,
        location: new firebase.firestore.GeoPoint(
          position.latitude,
          position.longitude
        ),
        timestamp: new firebase.firestore.Timestamp(
          Math.floor(timestamp / 1000)
        ),
      })
      .then(function(docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });
  }

  submitToFirebase = ({
    name,
    position,
    timestamp,
    imageDataUrl,
    totemCode,
  }) => {
    if (!name || !position || !timestamp || !imageDataUrl) {
      alert('Need all fields to be filled out!');
      return false;
    }

    return this.uploadImageToFirebase(imageDataUrl)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(imageUrl => {
        return this.uploadMetadata({
          name,
          position,
          timestamp,
          imageUrl,
          totemCode,
        });
      });
  };

  render() {
    const { totems } = this.props;
    const selectedTotem = totems.find(t => t.code === this.getTotemCode());

    if (!selectedTotem) {
      return (
        <div>
          <h1>Could not find a totem with the code {this.getTotemCode()}</h1>
        </div>
      );
    }

    return (
      <DetailsForm
        selectedTotem={selectedTotem}
        submitToFirebase={this.submitToFirebase}
      />
    );
  }
}

export default withRouter(LogDetails);