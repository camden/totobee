import React from 'react';
import { Link } from 'react-router-dom';
import { Firestore } from './firebase';
import cities from 'cities';

import styles from './Success.scss';

const parseInfo = data => {
  const { latitude, longitude } = data.location;
  const nearby = cities.gps_lookup(latitude, longitude);
  let city = 'City Unknown';
  if (nearby) {
    city = nearby.city;
  }

  return {
    totemCode: data.totemCode,
    name: data.name,
    city,
    imageUrl: data.imageUrl,
  };
};

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visits: [],
    };
  }

  componentDidMount() {
    Firestore.collection('visits')
      .get()
      .then(snapshot => {
        this.setState(state => ({
          ...state,
          visits: snapshot.docs.map(d => d.data()).map(parseInfo),
        }));
      });
  }

  formattedData = () => {
    const visits = this.state.visits;
    const totems = {};
    for (let i = 0; i < visits.length; i++) {
      const item = visits[i];
      const code = item.totemCode;
      if (!totems[code]) {
        totems[code] = [];
      }

      totems[code].push(item);
    }
    return totems;
  };

  render() {
    return (
      <div className={styles.container}>
        {Object.entries(this.formattedData()).map(([totemCode, visits]) => (
          <>
            <h2>{totemCode}</h2>
            <ol>
              {visits.map(visit => (
                <li>
                  <a href={visit.imageUrl} target="_blank">
                    {visit.city} by {visit.name}
                  </a>
                </li>
              ))}
            </ol>
          </>
        ))}
      </div>
    );
  }
}

export default Locations;
