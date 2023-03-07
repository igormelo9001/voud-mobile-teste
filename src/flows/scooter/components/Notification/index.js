// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';

// VouD imports
import BrandText from '../../../../components/BrandText';
import TouchableNative from '../../../../components/TouchableNative';
import { colors } from '../../../../styles';

// Component
class NotificationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true
    };

    this._timeout = null;

    this._animValue = new Animated.Value(0);
    this._animValue.addListener(({ value }) => { this.setState({ active:  true  }) });

    this._animOpacity = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    this._animTop = this._animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0]
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this._show();
      this._timeout = setTimeout(() => { this._dismiss() }, 6000);
    }
    else {
      this._dismiss();
    }
  }

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }

  _show = () => {
    Animated.timing(this._animValue, {
      toValue: 1,
      duration: 500
    }).start();
  };

  _dismiss = () => {
    if (this._timeout) clearTimeout(this._timeout);

    Animated.timing(this._animValue, {
      toValue: 0,
      duration: 250
    }).start(() => {
      // if (this.props.onDismiss) this.props.onDismiss();
    });
  };

  render() {
    // const { toast, hasConfigError } = this.props;

    const animStyle = {
      opacity: this._animOpacity,
      transform: [
        { translateY: this._animTop }
      ]
    };

    // if (hasConfigError) return null;

    return (
      <Animated.View
        pointerEvents={this.state.active ? 'auto' : 'none'}
        style={StyleSheet.flatten([styles.container, animStyle])}
      >
        <TouchableNative
          onPress={this._dismiss}
          style={styles.content}
        >
          <View style={{
            backgroundColor: "#fc7888",
            width: 30,
            height: 30,
            borderRadius: 30 / 2,
            marginLeft: 20,

          }}>

          </View>
          <View style={{ marginLeft: 20, }}>
            <BrandText style={styles.text}>Código inválido. Tente novamente!</BrandText>
          </View>
          {/* <BrandText style={styles.text}>
            {toast.message}
          </BrandText> */}
        </TouchableNative>
      </Animated.View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    height: 80,
    flex: 1,
    backgroundColor: "#656262",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: 'white'
  }
});

export default NotificationView;
