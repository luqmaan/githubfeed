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

const EventTypes = {
  WatchEvent: 'starred',
  CreateEvent: 'created',
  ForkEvent: 'forked',
  PublicEvent: 'published'
};

function getEventName(event) {
  return EventTypes[event.type];
}

function generateRows({repos, events}) {
  return events.map((event) => ({
    event: event,
    repo: repos[event.repo.url],
  }));
}


export default class FeedListView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds.cloneWithRows(props.events),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events
      || this.props.repos !== nextProps.repos
    ) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(generateRows(nextProps))
      })
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections
          renderRow={({event, repo}) => {
            return (
              <View key={event.id} style={styles.listItem}>
                <View style={styles.image}>
                  <Image source={{uri: `${event.actor.avatar_url}v=3&s=40`}} style={{width: 20, height: 20}} />
                </View>
                <View style={styles.text}>
                  <Text style={styles.action}>
                    <Text style={styles.link}>{event.actor.display_login}</Text>
                    <Text> {getEventName(event)} </Text>
                    <Text style={styles.link}>{event.repo.name}</Text>
                  </Text>
                  <Text style={styles.description}>{repo && repo.description}</Text>
                  <Text style={styles.stats}>{repo && `${repo.subscribers_count} 👀 ${repo.stargazers_count} ⭐ ${repo.forks_count} 🍴`}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomColor: '#bbc4e5',
    borderBottomWidth: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    margin: 5,
    marginRight: 0,
  },
  text: {
    margin: 5,
    flex: -1,
  },
  action: {
    marginBottom: 5,
  },
  link: {
    color: '#4078c0',
  },
  description: {
    color: '#727678'
  },
  stats: {
    opacity: 0.7,
  }
});
