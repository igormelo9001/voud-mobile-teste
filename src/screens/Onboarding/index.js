// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";
import Swiper from "react-native-swiper";

import { BackHandler, Platform, StyleSheet, View } from "react-native";

// VouD imports
import Icon from "../../components/Icon";
import TouchableNative from "../../components/TouchableNative";
import { dismissOnboarding } from "../../redux/onboarding";
import { getStatusBarHeight } from "../../styles/util";
import { dimensions } from "../../styles";
import { hasNotch } from "../../utils/has-notch";
import { colors } from "../../styles";

// Group imports
import OnboardingSlide from "./OnboardingSlide";
import SwiperPagination from "../../components/SwiperPagination";

// pagination
const renderPagination = (index, total, context) => {
  return (
    <SwiperPagination
      index={index}
      total={total}
      prev={{ text: "Voltar", action: () => context.scrollBy(-1) }}
      next={{ text: "Continuar", action: () => context.scrollBy(1) }}
      navByIndex={i => {
        context.scrollBy(i === 0 ? -1 : i);
      }}
      end={{ text: "Entendi!", action: context.props.dismiss }}
      styleAction={{ color: colors.WHITE }}
      styleDot={{ backgroundColor: colors.WHITE }}
      styleDotExternal={{
        position: "absolute",
        backgroundColor: colors.BRAND_SECONDARY
      }}
    />
  );
};

// screen component
class OnboardingView extends Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._backHandler);
  }

  _backHandler = () => {
    this._dismiss();
    return true;
  };

  _renderSlides = () => {
    return this.props.slides.map(slide => (
      <OnboardingSlide
        content={slide.content}
        image={slide.image}
        key={slide.id}
      />
    ));
  };

  _dismiss = () => {
    this.props.dispatch(dismissOnboarding());
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.slides[0] && (
          <Swiper
            loop={false}
            renderPagination={renderPagination}
            scrollEnabled={false}
            dismiss={this._dismiss}
          >
            {this._renderSlides()}
          </Swiper>
        )}
        <TouchableNative
          borderless
          onPress={this._dismiss}
          style={styles.dismissButton}
        >
          <Icon name="close" style={styles.dismissIcon} />
        </TouchableNative>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dismissButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top:
      getStatusBarHeight() +
      (Platform.OS === "ios" ? 8 : 12) +
      (hasNotch() ? dimensions.notchSpace.top : 0),
    left: Platform.OS === "ios" ? 8 : 12,
    width: 32,
    height: 32,
    backgroundColor: "transparent"
  },
  dismissIcon: {
    fontSize: 24,
    color: "white"
  }
});

// Redux
const mapStateToProps = state => {
  return {
    slides: state.onboarding.data
  };
};

export const Onboarding = connect(mapStateToProps)(OnboardingView);
