import React from 'react';
import { Link } from 'react-router-dom';
import { Firestore } from './firebase';
import cities from 'cities';

import styles from './Success.scss';

const getCity = data => {
  const { latitude, longitude } = data.location;
  const nearby = cities.gps_lookup(latitude, longitude);
  if (!nearby) {
    return 'City Unknown';
  } else {
    return nearby.city;
  }
};

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
    };
  }

  componentDidMount() {
    Firestore.collection('visits')
      .get()
      .then(snapshot => {
        this.setState(state => ({
          ...state,
          cities: snapshot.docs.map(d => d.data()).map(getCity),
        }));
      });
  }

  render() {
    return (
      <div className={styles.container}>
        <ol>
          {this.state.cities.map(city => (
            <li>{city}</li>
          ))}
        </ol>
      </div>
    );
  }
}

export default Locations;
