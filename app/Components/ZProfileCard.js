/**
 * @providesModule ZProfileCard
 */

import Icon from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

export default class ZProfileCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  render() {
    return (
      <View style={[{padding: 10, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderColor: '#E9E9E9'}, this.props.styles]}>
        {this.props.children}
      </View>
    );
  }

}
