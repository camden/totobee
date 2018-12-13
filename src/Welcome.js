import React from 'react';

import { Link } from 'react-router-dom';

import styles from './Welcome.scss';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  handleCodeChange = event => {
    this.setState({
      code: event.target.value.toLowerCase(),
    });
  };

  render() {
    const linkTo = `/log?code=${this.state.code}`;
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Say hi to Totobee.</h1>
        <p>
          A Totobee (a play on{' '}
          <span style={{ fontStyle: 'oblique' }}>Temporary Travel Buddy</span>)
          is a stationary nomad. Totobees hop from place to place with the help
          of people like you!
        </p>
        <p>
          Now, it's <span className={styles.emphasis}>your</span> turn to bring
          your Totobee somewhere new.
        </p>
        <label className={styles.inputLabel} htmlFor="code">
          Enter your Totobee's unique code:
        </label>
        <input
          className={styles.codeInput}
          type="text"
          placeholder="Input your Totobee's code"
          name="code"
          value={this.state.code}
          onChange={this.handleCodeChange}
        />
        <div>
          <Link to={linkTo}>
            <button
              className={styles.continueButton}
              disabled={!this.state.code}
            >
              Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
