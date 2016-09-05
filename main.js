import Exponent from 'exponent';
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

import FeedListView, {EventTypes} from './src/FeedListView';
import receivedEvents from './data/received_events.json';
import {GithubToken} from './constants/Secrets';

const headers = new Headers();
headers.append('Authorization', `token ${GithubToken}`);

class githubfeed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      repos: {},
      refreshing: false,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  loadFeed() {
    return fetch('https://api.github.com/users/luqmaan/received_events', {headers})
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          events: data.filter((event) => !!EventTypes[event.type])
        });
      });
  }

  loadRepos() {
    const urls = _.uniq(receivedEvents.map(event => event.repo.url));
    urls.map((url) => {
      fetch(url, {headers})
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

  refresh = () => {
    this.setState({refreshing: true});
    this.loadFeed()
      .then(() => this.loadRepos())
      .then(() => this.setState({refreshing: false}));
  }

  render() {
    return (
      <View style={styles.container}>
        <FeedListView
          events={this.state.events}
          repos={this.state.repos}
          refreshing={this.state.refreshing}
          refresh={this.refresh}
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

AppRegistry.registerComponent('main', () => githubfeed);
