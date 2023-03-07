// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View, WebView, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';

// Component
class BrowserView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    const { navigation: { state: { params: { closeAction }}}} = this.props;

    if (closeAction) {
      closeAction();
      return true;
    }
    return false;
  }

  _close = () => {
    const { dispatch, navigation: { state: { params: { closeAction }}}} = this.props;

    if (closeAction) {
      closeAction();
    } else {
      dispatch(NavigationActions.back());
    }
  };

  render() {
    const { navigation: { state: { params: { source }}}} = this.props;

    return (
      <View style={styles.container}>
        <Header
          title={source || 'URL não informada'}
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close,
          }}
        />
        {source && (
          <WebView
            source={{ uri: source }}
            style={styles.webView}
            javaScriptEnabled={false}
          />
        )}
      </View>
    );
}
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
});

export const Browser = connect()(BrowserView);
