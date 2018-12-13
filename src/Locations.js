import React from 'react';
import { Link } from 'react-router-dom';
import { Firestore, Firebase } from './firebase';

import styles from './Locations.scss';

const parseInfo = data => {
  return {
    totemCode: data.totemCode,
    name: data.name,
    message: data.message,
    location: data.location,
    imageUrl: data.imageUrl,
  };
};

const addCityData = data => {
  const findCities = Firebase.functions().httpsCallable('findCities');
  return findCities({ positions: data.map(d => d.location) }).then(result => {
    return result && result.data && result.data.cities;
  });
};

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      visits: [],
      cities: [],
    };
  }

  componentDidMount() {
    Firestore.collection('visits')
      .get()
      .then(snapshot => {
        const visits = snapshot.docs.map(d => d.data()).map(parseInfo);
        this.setState(state => ({
          ...state,
          visits,
        }));
        return visits;
      })
      .then(visits => {
        return addCityData(visits);
      })
      .then(cities => {
        this.setState(state => ({
          ...state,
          cities,
          isLoading: false,
        }));
      });
  }

  formattedData = () => {
    const visits = this.state.visits;
    const cities = this.state.cities;
    const totems = {};
    for (let i = 0; i < visits.length; i++) {
      const originalVisitInfo = visits[i];
      const cityInfo = cities[i];
      const code = originalVisitInfo.totemCode;
      if (!totems[code]) {
        totems[code] = [];
      }

      const updatedVisitInfo = {
        ...originalVisitInfo,
        city: cityInfo.city,
      };

      totems[code].push(updatedVisitInfo);
    }
    return totems;
  };

  getTotemDisplayName = totemCode => {
    const totem = this.props.totems.find(t => t.code === totemCode);
    if (totem) {
      return totem.displayName;
    } else {
      return totemCode;
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className={styles.container}>
          <h2>Loading...</h2>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {Object.entries(this.formattedData()).map(([totemCode, visits]) => (
          <>
            <h2>{this.getTotemDisplayName(totemCode)}</h2>
            <ol>
              {visits.map(visit => (
                <li>
                  <a href={visit.imageUrl} target="_blank">
                    {visit.name} from {visit.city}
                  </a>
                  {visit.message && <blockquote>{visit.message}</blockquote>}
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
