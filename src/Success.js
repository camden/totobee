import React from 'react';
import { Link } from 'react-router-dom';
import { Firebase } from './firebase';

import styles from './Success.scss';

class Success extends React.Component {
  componentDidMount() {
    const user = firebase.auth().currentUser;
    user.delete();
  }

  render() {
    return (
      <div className={styles.container}>
        <h1>Success!</h1>
        <p>Your Totobee has been logged successfully!</p>
        <p>
          Now, put your Totobee somewhere so another lucky person can find it!
        </p>
      </div>
    );
  }
}

export default Success;
