/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
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
import base64 from 'base-64';

import FeedListView from './src/FeedListView';
import receivedEvents from './data/received_events.json';


class githubfeed extends Component {

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
    const urls = _.uniq(receivedEvents.map(event => event.repo.url));
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

AppRegistry.registerComponent('githubfeed', () => githubfeed);
