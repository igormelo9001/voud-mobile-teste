// NPM imports
import React from "react";
import { Image, StyleSheet, View } from "react-native";

// VouD imports
import BrandText from "../BrandText";
import Icon from "../Icon";
import { headerActionTypes } from ".";
import { colors } from "../../styles";
import getIconName from "../../utils/get-icon-name";
import VoudTouchableOpacity from "../TouchableOpacity";
import { getPaddingForNotch } from "../../utils/is-iphone-with-notch";

// images
const voudLogo = require("../../images/logo-voud-sm.png");

// component
const HeaderIOS = ({
  title,
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

    return [containerStyles, style];
  };

  const renderSide = (prop, style) => {
    if (prop) {
      return (
        <VoudTouchableOpacity style={style} onPress={prop.onPress}>
          {renderSideContent(prop)}
          {prop.type === headerActionTypes.MENU && hasAlert && (
            <View style={styles.alertIndicator} />
          )}
        </VoudTouchableOpacity>
      );
    }

    return <View style={style} />;
  };

  const renderSideContent = prop => {
    switch (prop.type) {
      case headerActionTypes.MENU:
        return <Icon name="ios-menu" size={30} color={prop.color || "white"} />;

      case headerActionTypes.CLOSE:
        return (
          <BrandText
            style={[styles.actionText, { color: prop.color || "#FFF" }]}
          >
            Fechar
          </BrandText>
        );

      case headerActionTypes.MORE:
        return <Icon name="ios-more" size={30} color={prop.color || "white"} />;

      case headerActionTypes.EDIT:
        return <BrandText style={styles.actionText}>Editar</BrandText>;

      case headerActionTypes.HELP:
        return <BrandText style={styles.actionText}>Ajuda</BrandText>;

      case headerActionTypes.CUSTOM:
        return prop.iOSText ? (
          <BrandText style={styles.actionText}>{prop.IOSText}</BrandText>
        ) : (
          <View>
            <Icon
              name={getIconName(prop.icon)}
              size={30}
              color={prop.color || "white"}
            />
            {getIconName(prop.icon) === "notifications" && (
              <View style={styles.newNotificationIndicator} />
            )}
          </View>
        );

      case headerActionTypes.ADD:
        return <Icon name="add" size={30} color={prop.color || "white"} />;

      case headerActionTypes.REFRESH:
        return <Icon name="refresh1" size={30} color={prop.color || "white"} />;

      case headerActionTypes.INFO:
        return <Icon name="info" size={30} color={prop.color || "white"} />;

      default:
        // headerActionTypes.BACK
        return [
          <Icon
            key="0"
            name="ios-arrow-back"
            size={30}
            color={prop.color || "white"}
            style={{ marginRight: 4 }}
          />,
          <BrandText style={styles.actionText} key="1">
            Voltar
          </BrandText>
        ];
    }
  };

  const renderTitle = () => {
    return withLogo ? (
      <View style={styles.logoContainer}>
        <Image source={voudLogo} />
      </View>
    ) : (
      <BrandText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </BrandText>
    );
  };

  return (
    <View style={getContainerStyles()}>
      <View style={withLogo ? styles.contentWithLogo : styles.content}>
        {renderSide(left, styles.left)}
        {renderTitle()}
        {renderSide(right, styles.right)}
      </View>
      {renderExtension ? renderExtension() : null}
    </View>
  );
};

export default HeaderIOS;

// styles
const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    alignItems: "stretch",
    paddingTop: getPaddingForNotch() + 20, // status bar height
    backgroundColor: colors.BRAND_PRIMARY,
    borderBottomColor: colors.BRAND_PRIMARY_DARKER,
    borderBottomWidth: 1
  },
  containerElevation: {
    zIndex: 10,
    alignItems: "stretch",
    paddingTop: getPaddingForNotch() + 20, // status bar height
    backgroundColor: colors.BRAND_PRIMARY,
    borderBottomColor: colors.BRAND_PRIMARY_DARKER
  },
  borderless: {
    borderBottomWidth: null,
    backgroundColor: null
  },
  containerWithLogo: {
    alignItems: "stretch",
    paddingTop: 20 // status bar height
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8
  },
  contentWithLogo: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 8
  },
  left: {
    width: 80,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8
  },
  right: {
    width: 80,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 8
  },
  title: {
    flex: 1,
    fontSize: 17,
    textAlign: "center",
    color: colors.BRAND_SECONDARY
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16
  },
  actionText: {
    fontSize: 17,
    color: "white"
  },
  alertIndicator: {
    position: "absolute",
    top: 8,
    left: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.BRAND_ERROR
  },
  newNotificationIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.BRAND_ERROR
  }
});
