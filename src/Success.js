import React from 'react';
import Link from './Link';
import { Firebase } from './firebase';

import styles from './Success.scss';

class Success extends React.Component {
  componentDidMount() {
    const user = Firebase.auth().currentUser;
    if (user) {
      user.delete();
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>Success!</h1>
        <p>Your Totobee visit has been logged successfully!</p>
        <p>
          Once your Totobee has moved on, do not despair. Having fulfilled their
          dream, . Keep your dream in your heart, and part of your Totobee's
          spirit will remain with you.
        </p>
        <p>
          You can follow your Totobee's journey and read the dreams of others at{' '}
          <Link to="/locations">totobee.me/locations</Link>
        </p>
      </div>
    );
  }
}

export default Success;
