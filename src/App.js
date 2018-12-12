import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import LogDetails from './LogDetails';
import Welcome from './Welcome';

import styles from './App.scss';
import { Firestore } from './firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totems: [],
    };
  }

  componentDidMount() {
    Firestore.collection('totems')
      .get()
      .then(snapshot => {
        this.setState(state => ({
          ...state,
          totems: snapshot.docs.map(d => d.data()),
        }));
      });
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/success" render={() => <div>Success!</div>} />
            <Route exact path="/" component={Welcome} />
            <Route
              path="/log"
              render={() => <LogDetails totems={this.state.totems} />}
            />
            <Redirect to="/" />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
