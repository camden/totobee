import React from 'react';

import { Link } from 'react-router-dom';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  handleCodeChange = event => {
    this.setState({
      code: event.target.value,
    });
  };

  render() {
    const linkTo = `/log?code=${this.state.code}`;
    return (
      <div>
        <h1>Welcome to the site</h1>
        <label htmlFor="code">Your piff code: </label>
        <input
          type="text"
          name="code"
          value={this.state.code}
          onChange={this.handleCodeChange}
        />
        {this.state.code ? (
          <Link to={linkTo}>Continue</Link>
        ) : (
          <p>Enter a code to continue!</p>
        )}
      </div>
    );
  }
}

export default Welcome;
