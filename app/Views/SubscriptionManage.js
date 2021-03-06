import ZTextMedium from 'ZTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  colors,
  ImageBackground,
  Platform,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import { bindActionCreators } from 'redux';

import {
  StackNavigator,
} from 'react-navigation';

import * as actions from '../Reducers/subscriptionActions';

import API from 'API';
class SubscriptionManage extends Component {

  constructor(props) {
    super(props);
    const { state } = props.navigation;
    const premium = state.params.type === "premium";
    this.state = {
      isLoading: false,
      title: premium ? 'Your Subscription' : 'Managing Staff',
      type: premium ? 'Attender Premium' : state.params.staff.staffId.fullname,
      price: `\$${state.params.staff.price}`,
      purchase: moment(state.params.staff.purchaseDate).format('MMMM D YYYY'),
      expire: moment(state.params.staff.expireDate).format('MMMM D YYYY'),
    }
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
  }

  renderOnShowLoading = () => {
    if (this.state.isLoading) {
      return (
        <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
          <ActivityIndicator animating={this.state.isLoading} size="large" color="white"/>
          <Text style={{fontSize: 10, marginTop: 5, color: 'white'}}>Loading data...</Text>
        </View>
      )
    }
  }

  renderHeader() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginLeft: 20 }}>
        <TouchableOpacity onPress={() => goBack(this.state.from)}>
          <Icon name="ios-arrow-round-back-outline" size={35} color="#BEBEBE" style={{ backgroundColor: 'transparent' }} />
        </TouchableOpacity>
      </View>
    );
  }

  renderButtons() {
    const { goBack, state } = this.props.navigation;
    const { subscription } = this.props.Subscription
    const premium = state.params.type === "premium";
    let subscribe = true;
    if (premium) {
      subscribe = subscription.status === 'subscribe';
    } else {
      subscribe = state.params.staff.status === 'subscribe';
    }
    return (
      <View style={{flexDirection: 'row', marginBottom: 8, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity 
          onPress={() =>  {
            if(premium) {
              this.props.actions.cancelPremium((data) => {
                this.props.actions.checkSubscription((data) => {
                  if (data.status) {
                    this.props.dispatch({ type: 'SET_SUBSCRIPTION', payload: data.subscription });
                  }
                });
              });
            } else {
              this.props.actions.cancelManage(state.params.staff.staffId._id, (data) => {
                this.props.actions.getStaffSubscriptions(data => {
                  this.props.dispatch({ type: 'SET_STAFF_SUBSCRIPTION', payload: data.subscriptions });
                  goBack();
                });
              });
            }
          }}
        >
          <View style={{borderRadius: 5, backgroundColor: subscribe ? '#5FDAE9' : 'red', padding: 5, margin: 10, width: 180, height: 40, borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontFamily: 'AvenirNextLTPro-Demi', fontSize: 14, color: 'white'}}>{subscribe ? 'Cancel Subscription' : 'Cancelled Subscription' }</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderPremium() {
    return (
      <View style={{ padding: 30 }}>
        <Text style={{
          fontFamily: 'AvenirNextLTPro-Medium', 
          color: '#000',
          backgroundColor: 'transparent', 
          fontSize: 16, 
          }}
        >
          {this.state.title}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          <Text style={{
            fontFamily: 'AvenirNextLTPro-Regular', 
            color: '#8B8B8B',
            backgroundColor: 'transparent', 
            fontSize: 16, 
            marginTop: 16 
            }}
          >
            {this.state.type}
          </Text>
          <View>
            <Text 
              style={{
                fontFamily: 'AvenirNextLTPro-Medium', 
                color: '#8B8B8B',
                backgroundColor: 'transparent', 
                fontSize: 18, 
                marginTop: 16,
                justifyContent: 'flex-end',
                textAlign: 'right',
              }}
            >
              {this.state.price}/mo
            </Text>
            <Text 
              style={{
                fontFamily: 'AvenirNextLTPro-It', 
                color: '#8B8B8B',
                backgroundColor: 'transparent', 
                fontSize: 12,
                justifyContent: 'flex-end'
              }}
            >
              One month of Service
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 60, borderBottomColor: '#000', padding: 2, borderBottomWidth: StyleSheet.hairlineWidth }} >
          <Text 
              style={{
                fontFamily: 'AvenirNextLTPro-It', 
                color: '#8B8B8B',
                backgroundColor: 'transparent', 
                fontSize: 12,
                justifyContent: 'flex-end'
              }}
            >
            Purchase {this.state.purchase}
          </Text>

          <Text 
            style={{
              fontFamily: 'AvenirNextLTPro-It', 
              color: '#8B8B8B',
              backgroundColor: 'transparent', 
              fontSize: 12,
              justifyContent: 'flex-end'
            }}
          >
            Expire {this.state.expire}
          </Text>

        </View>
        <Text 
            style={{
              fontFamily: 'AvenirNextLTPro-It', 
              color: '#4AC5D4',
              backgroundColor: 'transparent', 
              fontSize: 13,
              justifyContent: 'flex-end',
              marginTop: 2
            }}
          >
            Note: Subscription are renewed on a month by month basis until cancelled.
          </Text>
      </View>
    );
  }

  renderContent = () => {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ alignItems: 'flex-start'}}>
          {this.renderHeader()}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {this.renderPremium()}
          {this.renderButtons()}
        </View>
      </View>
    );
  }


  render() {
    return (
      <View style={{flex: 1, paddingTop: (Platform.OS === 'ios' ? 30: 0), backgroundColor: '#fff'}}>
        {this.renderContent()}
        {this.renderOnShowLoading()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch,
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionManage);

