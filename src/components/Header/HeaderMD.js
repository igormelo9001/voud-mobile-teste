// NPM imports
import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableNativeFeedback,
  View
} from "react-native";

// VouD imports
import Icon from "../Icon";
import BrandText from "../BrandText";
import { headerActionTypes } from ".";
import { colors } from "../../styles";
import getIconName from "../../utils/get-icon-name";

// images
const voudLogo = require("../../images/logo-voud-sm.png");

// component
const HeaderMD = ({
  title,
  titleStyle,
  customContainerStyle,
  hasAlert,
  left,
  right,
  borderless,
  withLogo,
  renderExtension,
  backgroundColor,
  isRequestCard
}) => {
  const getContainerStyles = () => {
    const containerStyles = isRequestCard
      ? styles.containerElevation
      : styles.container;
    let style = {};
    if (backgroundColor) style = { backgroundColor };

    if (withLogo) return [styles.containerWithLogo, style];

    if (borderless)
      return StyleSheet.flatten([styles.container, styles.borderless, style]);

    return [containerStyles, style, customContainerStyle];
  };

  const getIconContainerStyles = (addMarginRight = false) => {
    const containerStyles = [styles.iconContainer];
    containerStyles.push(
      addMarginRight
        ? styles.iconContainerMarginRight
        : styles.iconContainerMarginLeft
    );
    return StyleSheet.flatten(containerStyles);
  };

  const renderSide = (prop, addMarginRight) => {
    if (prop) {
      const background =
        Platform.Version >= 21
          ? TouchableNativeFeedback.Ripple("rgba(0,0,0,0.5)", true)
          : TouchableNativeFeedback.SelectableBackground();

      return (
        <TouchableNativeFeedback onPress={prop.onPress} background={background}>
          <View style={getIconContainerStyles(addMarginRight)}>
            <Icon
              name={iconName(prop)}
              size={24}
              color={prop.color || "white"}
            />
            {iconName(prop) === "notifications" && (
              <View style={styles.newNotificationIndicator} />
            )}
            {prop.type === headerActionTypes.MENU && hasAlert && (
              <View style={styles.alertIndicator} />
            )}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return <View style={getIconContainerStyles()} />;
  };

  const iconName = prop => {
    switch (prop.type) {
      case headerActionTypes.MENU:
        return "md-menu";

      case headerActionTypes.CLOSE:
        return "close";

      case headerActionTypes.MORE:
        return "md-more";

      case headerActionTypes.EDIT:
        return "md-edit";

      case headerActionTypes.SEARCH:
        return "md-search";

      case headerActionTypes.HELP:
        return "help-outline";

      case headerActionTypes.CUSTOM:
        return getIconName(prop.icon);

      case headerActionTypes.ADD:
        return "add";

      case headerActionTypes.REFRESH:
        return "refresh1";

      case headerActionTypes.INFO:
        return "info";

      default:
        // headerActionTypes.BACK
        return "md-arrow-back";
    }
  };

  const renderTitle = () => {
    return withLogo ? (
      <View style={styles.logoContainer}>
        <Image source={voudLogo} />
      </View>
    ) : (
      <BrandText
        style={[styles.title, titleStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </BrandText>
    );
  };

  const renderDefaultHeader = () => {
    return (
      <View style={withLogo ? styles.contentWithLogo : styles.content}>
        {renderSide(left, true)}
        {renderTitle()}
        {renderSide(right, false)}
      </View>
    );
  };

  return (
    <View style={getContainerStyles()}>
      {renderDefaultHeader()}
      {renderExtension ? renderExtension() : null}
    </View>
  );
};

export default HeaderMD;

// styles
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
    alignItems: "stretch",
    backgroundColor: colors.BRAND_PRIMARY,
    elevation: 8
  },
  containerElevation: {
    paddingTop: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
    alignItems: "stretch",
    backgroundColor: colors.BRAND_PRIMARY,
    elevation: 0
  },
  containerWithLogo: {
    paddingTop: Platform.Version >= 21 ? StatusBar.currentHeight : 0,
    alignItems: "stretch"
  },
  borderless: {
    backgroundColor: null,
    elevation: null
  },
  content: {
    flexDirection: "row",
    alignItems: "center"
  },
  contentWithLogo: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  iconContainer: {
    width: 56,
    height: 56,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  iconContainerMarginRight: {
    marginRight: 16
  },
  iconContainerMarginLeft: {
    marginLeft: 16
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: "white"
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16
  },
  alertIndicator: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.BRAND_ERROR
  },
  newNotificationIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.BRAND_ERROR
  }
});
