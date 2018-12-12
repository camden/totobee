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
        <h1 className={styles.title}>Say hi to Piff.</h1>
        <label className={styles.inputLabel} htmlFor="code">
          Enter your Piff's unique code:
        </label>
        <input
          className={styles.codeInput}
          type="text"
          placeholder="Input your Piff code"
          name="code"
          value={this.state.code}
          onChange={this.handleCodeChange}
        />
        <div>
          <Link to={linkTo}>
            <button className={styles.ctaButton} disabled={!this.state.code}>
              Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
