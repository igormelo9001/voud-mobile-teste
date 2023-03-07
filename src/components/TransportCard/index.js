// NPM imports
import React, { Component } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

// VouD imports
import { colors } from "../../styles";
import { transportCardTypes } from "../../redux/transport-card";

// Component imports
import TransportCardHeader from "./Header";
import TransportCardFooter from "./Footer";
import BomComumContent from "./BomComumContent";
import BomEscolarContent from "./BomEscolarContent";
import BomEscolarGratuidadeContent from "./BomEscolarGratuidadeContent";
import BomVTContent from "./BomVTContent";
import BomVTExpressContent from "./BomVTExpressContent";
import BilheteUnicoContent from "./BilheteUnicoContent";
import CartaoLegalContent from "./CartaoLegalContent";

import Loader from "../Loader";
import VoudTouchableOpacity from "../TouchableOpacity";
import BlockTag from "./BlockTag";
import { isTransportCardScholarNotRevalidated } from "../../utils/transport-card";
import Icon from "../Icon";
import BrandText from "../BrandText";
import { connect } from "react-redux";

// const definitions
export const TRANSPORT_CARD_HEIGHT = 216;
export const TRANSPORT_CARD_COLLAPSED_HEIGHT = 128;

const { width } = Dimensions.get("window");

// component
const bomComumBgImg = require("../../images/transport-cards/bom-comum-bg.png");
const bomEscolarBgImg = require("../../images/transport-cards/bom-escolar-bg.png");
const bomVtBgImg = require("../../images/transport-cards/bom-vt-bg.png");
const buBgImg = require("../../images/transport-cards/bu-bg.png");
const refreshing = require("../../images/ic-refresh.png");
const bomBlur = require("../../images/bom-desfoque.png");
const legalBgImg = require("../../images/transport-cards/legal-bg.png");

class TransportCard extends Component {
  _renderContent = () => {
    const { data, collapse, small } = this.props;

    if (data.layoutType === transportCardTypes.BU)
      return (
        <BilheteUnicoContent data={data} collapse={collapse} small={small} />
      );

    if (data.layoutType === transportCardTypes.LEGAL)
      return (
        <CartaoLegalContent data={data} collapse={collapse} small={small} />
      );

    if (data.layoutType == transportCardTypes.BOM_COMUM) {
      return <BomComumContent data={data} collapse={collapse} small={small} />;
    } else if (data.layoutType == transportCardTypes.BOM_ESCOLAR) {
      return (
        <BomEscolarContent data={data} collapse={collapse} small={small} />
      );
    } else if (data.layoutType == transportCardTypes.BOM_ESCOLAR_GRATUIDADE) {
      return (
        <BomEscolarGratuidadeContent
          data={data}
          collapse={collapse}
          small={small}
        />
      );
    } else if (data.layoutType == transportCardTypes.BOM_VT) {
      return <BomVTContent data={data} collapse={collapse} small={small} />;
    } else if (data.layoutType == transportCardTypes.BOM_VT_EXPRESS) {
      return (
        <BomVTExpressContent data={data} collapse={collapse} small={small} />
      );
    }

    // if transportCardTypes.BOM_COMUM (default)
    return <BomComumContent data={data} collapse={collapse} small={small} />;
  };

  _renderFooter = () => {
    const { data, collapse, onHelp, small } = this.props;

    if (
      data.layoutType === transportCardTypes.BU ||
      data.layoutType === transportCardTypes.LEGAL
    ) {
      return null;
    }

    return (
      <TransportCardFooter
        data={data}
        collapse={collapse}
        onHelp={onHelp}
        small={small}
      />
    );
  };

  bgStyle = type => {
    switch (type) {
      case transportCardTypes.BU:
        return styles.buBgImg;
      case transportCardTypes.LEGAL:
        return styles.legalBgImg;

      default:
        return styles.bomBgImg;
    }
  };

  _renderBgImage = () => {
    const { data, collapse } = this.props;

    const isBu = data && data.layoutType === transportCardTypes.BU;

    const bgOpacity = collapse
      ? collapse.interpolate({
          inputRange: [0, 0.5],
          outputRange: [1, 0],
          extrapolate: "clamp"
        })
      : 1;

    // const bgStyle = isBu ? styles.buBgImg : styles.bomBgImg;
    const bgStyle = this.bgStyle(data.layoutType);

    let bgImg;

    if (isBu) bgImg = buBgImg;
    else if (data.layoutType === transportCardTypes.LEGAL) bgImg = legalBgImg;
    else if (data.layoutType == transportCardTypes.BOM_COMUM)
      bgImg = bomComumBgImg;
    else if (
      data.layoutType == transportCardTypes.BOM_ESCOLAR ||
      data.layoutType == transportCardTypes.BOM_ESCOLAR_GRATUIDADE
    )
      bgImg = bomEscolarBgImg;
    else if (
      data.layoutType == transportCardTypes.BOM_VT ||
      data.layoutType == transportCardTypes.BOM_VT_EXPRESS
    )
      bgImg = bomVtBgImg;
    else return null;

    return (
      <Animated.Image
        source={bgImg}
        resizeMode="stretch"
        style={StyleSheet.flatten([bgStyle, { opacity: bgOpacity }])}
      />
    );
  };

  _renderSpinner = () => {
    const { isUpdating, showSpinner, small } = this.props;

    if (!isUpdating) {
      return null;
    }

    return showSpinner ? (
      <View style={styles.loaderContainer}>
        <Loader
          text="Atualizando cartões..."
          style={StyleSheet.flatten([
            styles.loader,
            small ? styles.loaderSmall : {}
          ])}
          isLight
        />
      </View>
    ) : (
      <View style={styles.loaderContainer} />
    );
  };

  render() {
    const {
      data,
      onPress,
      collapse,
      style,
      small,
      onLayout,
      cardList
    } = this.props;
    const cardHeight = collapse
      ? collapse.interpolate({
          inputRange: [0, 1],
          outputRange: [TRANSPORT_CARD_HEIGHT, TRANSPORT_CARD_COLLAPSED_HEIGHT]
        })
      : TRANSPORT_CARD_HEIGHT;

    const showBlockTag = isTransportCardScholarNotRevalidated(data);
    const CardContainer =
      onPress && !showBlockTag ? VoudTouchableOpacity : View;

    // Card with action
    if (!data) {
      return (
        <View style={styles.containerRefreshing}>
          {!cardList.isFetching && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image source={bomBlur} />
              <View style={{ position: "absolute" }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this.props.onRefreshing}
                  style={styles.buttonRefreshing}
                  textStyle={styles.buttonTextRefreshing}
                >
                  <Image source={refreshing} />
                  <BrandText style={styles.textRefreshingBalance}>
                    Ver Saldo
                  </BrandText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {cardList.isFetching && (
            <View style={styles.containerLoader}>
              <View style={styles.containerInternalLoader}>
                <Loader text={"Aguarde"} />
              </View>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <Animated.View
          onLayout={onLayout}
          style={StyleSheet.flatten([
            styles.container,
            { height: cardHeight },
            style
          ])}
        >
          <CardContainer
            onPress={onPress}
            style={StyleSheet.flatten([
              styles.cardContainer,
              showBlockTag ? styles.blockedStyle : {}
            ])}
          >
            <TransportCardHeader small={small} data={data} />
            <View style={styles.main}>
              {this._renderBgImage()}
              {this._renderContent()}
              {this._renderFooter()}
            </View>
          </CardContainer>

          {showBlockTag && <BlockTag style={styles.blockTag} cardData={data} />}
          {this._renderSpinner()}
        </Animated.View>
      );
    }
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    borderRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    backgroundColor: "white",
    borderColor:
      Platform.OS === "android" && Platform.Version < 21
        ? colors.OVERLAY_LIGHT
        : "transparent",
    borderWidth: Platform.OS === "android" && Platform.Version < 21 ? 1 : 0
  },
  cardContainer: {
    flex: 1
  },
  main: {
    flex: 1
  },
  bomBgImg: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    borderRadius: 4
  },
  buBgImg: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: null,
    borderRadius: 4
  },
  legalBgImg: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: null,
    height: null,
    borderRadius: 4
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 4,
    backgroundColor: colors.OVERLAY
  },
  loader: {
    top: 40,
    alignSelf: "center",
    justifyContent: "center"
  },
  loaderSmall: {
    height: 110
  },
  blockedStyle: {
    opacity: 0.3
  },
  blockTag: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 40,
    width: "100%"
  },
  containerRefreshing: {
    // position: "absolute",
    // left: 0,
    // right: 0,
    // bottom: 0,
    // top: 0,
    // justifyContent: "center",
    // alignItems: "center",
    // borderRadius: 4,
    // backgroundColor:"blue",
    // padding: 10,
    right: 0,
    left: 0,
    marginBottom: 0,
    position: "absolute",
    zIndex: 10,
    marginTop: 70,
    elevation: 8
  },
  buttonRefreshing: {
    alignItems: "flex-start"
  },
  buttonTextRefreshing: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Raleway",
    lineHeight: 16
  },
  containerImageBlur: {
    elevation: 8,
    // marginTop: -113,
    right: 0,
    left: 0,
    marginBottom: 0,
    // top:0,
    // zIndex:8,
    position: "absolute"
    // backgroundColor:"red",
  },
  containerImageBlurInternal: {
    // alignItems: "center",
    // justifyContent: "center"
  },
  textRefreshingBalance: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
    alignItems: "center",
    color: "#6E3E91",
    marginTop: 8
  },
  containerInternalLoader: {
    height: 216,
    backgroundColor: "white",
    width: width - 16,
    alignSelf: "stretch",
    elevation: 6,
    borderRadius: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    borderColor:
      Platform.OS === "android" && Platform.Version < 21
        ? colors.OVERLAY_LIGHT
        : "transparent",
    borderWidth: Platform.OS === "android" && Platform.Version < 21 ? 1 : 0,
    alignItems: "center",
    justifyContent: "center"
  },
  containerLoader: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8
  }
});

const mapToStateProps = state => {
  return {
    cardList: state.transportCard.cardList
  };
};

export default connect(mapToStateProps)(TransportCard);
