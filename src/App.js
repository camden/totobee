import React from 'react';
import * as firebase from 'firebase';
import { Firestore } from './firestore';

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

  submitToFirebase = () => {
    // Add a second document with a generated ID.
    const { name, position, timestamp } = this.state;
    if (!name || !position || !timestamp) {
      alert('Need all fields to be filled out!');
      return false;
    }

    this.setState({
      loading: true,
    });

    Firestore.collection('visits')
      .add({
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
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { position } = this.state;
    return (
      <div>
        <h1>Where's Caesar?</h1>
        <h2>To log your find, we need some info from you!</h2>
        {this.state.loading ? <div>LOADING</div> : null}
        <label htmlFor="name">Your Name: </label>
        <input
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.logVisit}>Get Location</button>
        <div>
          Position: {position && position.latitude} x{' '}
          {position && position.longitude}
        </div>
        <div>Timestamp: {this.state.timestamp}</div>

        <button
          onClick={this.submitToFirebase}
          disabled={
            !(this.state.position && this.state.timestamp && this.state.name)
          }
        >
          Submit
        </button>
      </div>
    );
  }
}

export default App;
