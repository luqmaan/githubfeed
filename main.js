/** In order for logging to stream to XDE or the exp CLI you must import the
  * exponent module at some point in your app */
import Exponent from 'exponent';

import React, { Component } from 'react';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import {
  Platform,
  StatusBar,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
  ScrollView,
  ListView,
  Image,
} from 'react-native';

import _ from 'lodash';

import FeedListView from './components/FeedListView';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      repos: {},
    };
  }

  componentDidMount() {
    this.loadFeed()
      .then(() => this.loadRepos())
  }

  loadFeed() {
    return fetch('https://api.github.com/users/luqmaan/received_events')
      .then((res) => res.json())
      .then((data) => this.setState({events: data}));
  }

  loadRepos() {
    const urls = _.uniq(this.state.events.map(event => event.repo.url));
    urls.map((url) => {
      fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          repos: {
            ...this.state.repos,
            [url]: data,
          }
        });
      });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hi</Text>
        <FeedListView
          events={this.state.events}
          repos={this.state.repos}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('main', () => AppContainer);
