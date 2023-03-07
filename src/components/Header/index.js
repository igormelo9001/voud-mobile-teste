// NPM imports
import React from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";

// VouD imports
import HeaderIOS from "./HeaderIOS";
import HeaderMD from "./HeaderMD";
import { getHasProfileAlerts } from "../../redux/selectors";

// Action types
export const headerActionTypes = {
  BACK: "voud/headerActions/BACK",
  MENU: "voud/headerActions/MENU",
  CLOSE: "voud/headerActions/CLOSE",
  MORE: "voud/headerActions/MORE",
  EDIT: "voud/headerActions/EDIT",
  SEARCH: "voud/headerActions/SEARCH",
  HELP: "voud/headerActions/HELP",
  CUSTOM: "voud/headerActions/CUSTOM",
  ADD: "voud/headerActions/ADD",
  REFRESH: "voud/headerActions/REFRESH",
  INFO: "voud/headerActions/INFO"
};

// Component
const Header = ({
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
  return Platform.OS === "ios" ? (
    <HeaderIOS
      withLogo={withLogo}
      title={title}
      titleStyle={titleStyle}
      customContainerStyle={customContainerStyle}
      hasAlert={hasAlert}
      left={left}
      right={right}
      borderless={borderless}
      renderExtension={renderExtension}
      backgroundColor={backgroundColor}
      isRequestCard={isRequestCard}
    />
  ) : (
    <HeaderMD
      withLogo={withLogo}
      title={title}
      titleStyle={titleStyle}
      customContainerStyle={customContainerStyle}
      hasAlert={hasAlert}
      left={left}
      right={right}
      borderless={borderless}
      renderExtension={renderExtension}
      backgroundColor={backgroundColor}
      isRequestCard={isRequestCard}
    />
  );
};

// Redux
const mapStateToProps = state => {
  return {
    hasAlert: getHasProfileAlerts(state)
  };
};

export default connect(mapStateToProps)(Header);
