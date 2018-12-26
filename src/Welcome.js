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

  renderDescription() {
    return (
      <>
        <p>
          A Totobee is a nature spirit whose essence is imbued into a physical
          form. They exist on this realm to bring dreams to consciousness so
          that people might find their path in life.
        </p>

        <p className={styles.emphasis}>
          A dream immaterial is a dream unfulfilled!
        </p>

        <p>What's your dream?</p>

        <p>It’s time to meet your Totobee and begin your journey.</p>
      </>
    );
  }

  render() {
    const linkTo = `/log?code=${this.state.code}`;
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Say hi to Totobee.</h1>
        {this.renderDescription()}
        <label className={styles.inputLabel} htmlFor="code">
          Enter your Totobee's unique code:
        </label>
        <input
          className={styles.codeInput}
          type="text"
          placeholder="Input your Totobee's code"
          id="code"
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
