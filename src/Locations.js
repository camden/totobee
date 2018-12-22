import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Firestore, Firebase } from './firebase';
import Link from './Link';

import styles from './Locations.scss';

const parseInfo = data => {
  return {
    totemCode: data.totemCode,
    name: data.name,
    message: data.message,
    location: data.location,
    imageUrl: data.imageUrl,
    timestamp: data.timestamp,
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
      return 'Unknown totem';
    }
  };

  getVisitMessage = _message => {
    let message = _message;

    const maxLength = 200;

    if (message.length > maxLength) {
      message = message.substr(0, maxLength) + '...';
    }

    return message && <blockquote>{message}</blockquote>;
  };

  getDateFromTimestamp = _timestamp => {
    return format(
      new Date(_timestamp.seconds * 1000),
      'MMM Do, YYYY [at] h:ma'
    );
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
            <div className={styles.header}>
              <h1 className={styles.totemName}>
                {this.getTotemDisplayName(totemCode)}
              </h1>
              <div className={styles.caption}>It's not easy being gourd.</div>
            </div>
            <div className={styles.verticalLine} />
            <ol className={styles.visitList}>
              {visits.map(visit => (
                <li
                  className={styles.visit}
                  key={visit.name + ' ' + visit.city}
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={styles.icon}
                    size="m"
                  />
                  <Link to={visit.imageUrl} target="_blank">
                    {visit.name} from {visit.city}
                  </Link>
                  <div className={styles.timestamp}>
                    {this.getDateFromTimestamp(visit.timestamp)}
                  </div>
                  {this.getVisitMessage(visit.message)}
                </li>
              ))}
              <li className={`${styles.visit} ${styles.birth}`}>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={styles.iconBirth}
                  size="m"
                />
                {this.getTotemDisplayName(totemCode)} was created.
              </li>
            </ol>
            <div className={styles.footer} />
          </>
        ))}
      </div>
    );
  }
}

export default Locations;
