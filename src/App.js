import React from 'react';
import firebase from 'firebase/app';
import { Firestore, Storage } from './firebase';
import ImageUpload from './ImageUpload';

import styles from './App.scss';

// Returns a promise
const getVisitInfo = () => {
  return new Promise((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(position =>
      resolve(position)
    );
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      position: null,
      timestamp: null,
      name: '',
      image: null,
    };
  }

  logVisit = () => {
    this.setState({
      loading: true,
    });
    getVisitInfo().then(info => {
      this.setState({
        loading: false,
      });
      this.setState(state => {
        return {
          ...state,
          position: info.coords,
          timestamp: info.timestamp,
        };
      });
    });
  };

  handleNameChange = event => {
    const name = event.target.value;
    this.setState({ name });
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

  uploadMetadata({ name, position, timestamp, imageUrl }) {
    return Firestore.collection('visits')
      .add({
        imageUrl,
        name,
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

  submitToFirebase = () => {
    // Add a second document with a generated ID.
    const { name, position, timestamp, image } = this.state;
    if (!name || !position || !timestamp || !image) {
      alert('Need all fields to be filled out!');
      return false;
    }

    this.setState({
      loading: true,
    });

    this.uploadImageToFirebase(image)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(imageUrl => {
        return this.uploadMetadata({
          name,
          position,
          timestamp,
          imageUrl,
        });
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  handleImageChange = imageURL => {
    this.setState(state => ({
      ...state,
      image: imageURL,
    }));
  };

  render() {
    const { position } = this.state;
    return (
      <div>
        <h1 className={styles.title}>Where's Caesar?</h1>
        <h2>To log your find, we need some info from you!</h2>
        {this.state.loading ? <div>LOADING</div> : null}
        <label htmlFor="name">Your Name: </label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <ImageUpload onImageChange={this.handleImageChange} />
        <button onClick={this.logVisit}>Get Location</button>
        <div>
          Position: {position && position.latitude} x{' '}
          {position && position.longitude}
        </div>
        <div>Timestamp: {this.state.timestamp}</div>

        <button
          onClick={this.submitToFirebase}
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

export default App;
