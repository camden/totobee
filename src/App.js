import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import LogDetails from './LogDetails';
import Welcome from './Welcome';

import { Firestore } from './firebase';
import Success from './Success';
import Locations from './Locations';

import styles from './App.scss';

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
      <div style={{ height: '100%', minHeight: '100%' }}>
        <Router>
          <Switch>
            <Route
              exact
              path="/locations"
              render={() => <Locations totems={this.state.totems} />}
            />
            <Route exact path="/success" component={Success} />
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
