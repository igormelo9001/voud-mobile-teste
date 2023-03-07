// NPM imports
import React from "react";
import PropTypes from "prop-types";
import { Image, ScrollView, StyleSheet, View } from "react-native";

// VouD imports
import BrandText from "../BrandText";
import ContentPlaceholder from "../ContentPlaceholder";
import { transportCardTypes, issuerTypes } from "../../redux/transport-card";
import { colors } from "../../styles";

// Component imports
import TransportCardBadge from "./TransportCardBadge";
import RequestError from "../RequestError";

// Images
const badgeMask = require("../../images/transport-cards/badge-mask.png");

import { getQrCodeVisible } from "../../shared/remote-config";

// Component
const propTypes = {
  data: PropTypes.array.isRequired,
  ui: PropTypes.shape({
    error: PropTypes.string,
    isFetching: PropTypes.bool
  }).isRequired,
  onCardPress: PropTypes.func,
  onAddPress: PropTypes.func,
  onRetry: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  contentStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const defaultProps = {
  onCardPress: () => {},
  onAddPress: () => {},
  onRetry: () => {},
  style: {},
  contentStyle: {}
};

// styles
const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  cardList: {
    flexDirection: "row"
  },
  connector: {
    position: "absolute",
    top: 31,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: colors.GRAY_LIGHTER
  },
  item: {
    width: 64,
    height: 96,
    marginLeft: 8,
    backgroundColor: "white"
  },
  add: {
    marginLeft: 0,
    marginRight: 16
  },
  firstItem: {
    marginLeft: 8
  },
  empty: {
    marginLeft: 8
  },
  itemText: {
    flex: 1,
    marginTop: 8,
    alignSelf: "stretch",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.BRAND_PRIMARY_DARKER
  },
  itemTextEmpty: {
    fontWeight: "normal",
    color: colors.GRAY_DARK
  },
  // loading state
  placeholder: {
    width: 64,
    height: 96,
    marginLeft: 8,
    backgroundColor: colors.GRAY_LIGHTER
  },
  placeholderMaskBadge: {
    width: 64,
    height: 64
  },
  placeholderMaskSpacer: {
    alignSelf: "stretch",
    height: 8,
    backgroundColor: "white"
  },
  // error state
  error: {
    flex: 1,
    alignItems: "stretch"
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    color: colors.GRAY_DARK
  },
  errorRetry: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.BRAND_PRIMARY_DARKER
  }
});

class TransportCardBadgesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcodeVisible: false
    };
  }

  hasPendingRecharges = transportCard => !transportCard.nextRecharges == null;

  renderTicketUnitary = async () => {
    const { listTicket } = this.props;
    return listTicket.data.length > 0;
  };

  renderList = () => {
    const {
      data,
      ui,
      onCardPress,
      onRetry,
      onAddPress,
      ticketUnitaryAvailable
    } = this.props;

    let isBiun;

    if (ticketUnitaryAvailable !== undefined)
      isBiun = ticketUnitaryAvailable.data.visible;

    if (ui.isFetching) {
      return (
        <ContentPlaceholder
          duration={1000}
          style={styles.placeholder}
          renderMask={() => (
            <React.Fragment>
              <Image source={badgeMask} style={styles.placeholderMaskBadge} />
              <View style={styles.placeholderMaskSpacer} />
            </React.Fragment>
          )}
        />
      );
    }

    if (ui.error) {
      return <RequestError error={ui.error} onRetry={onRetry} />;
    }

    return (
      <View style={styles.cardList}>
        <View style={styles.connector} />
        {isBiun && (
          <View style={styles.item}>
            <TransportCardBadge
              type="Bilhete Unitário"
              onPress={() => {
                onAddPress("BIUN");
              }}
            />
            <BrandText style={styles.itemText}>Bilhete QR Code</BrandText>
          </View>
        )}
        {data.map(transportCard => (
          <View key={transportCard.id} style={styles.item}>
            <TransportCardBadge
              type={transportCard.layoutType}
              onPress={() => {
                onCardPress(transportCard);
              }}
              hasPendingRecharges={this.hasPendingRecharges(transportCard)}
            />
            <BrandText style={styles.itemText}>{transportCard.nick}</BrandText>
          </View>
        ))}
      </View>
    );
  };

  render() {
    const { data, ui, onAddPress, style, contentStyle } = this.props;
    const hasBU = data.find(
      transportCard => transportCard.layoutType === transportCardTypes.BU
    );
    const hasBOM = data.find(
      transportCard =>
        transportCard.layoutType === transportCardTypes.BOM_COMUM ||
        transportCard.layoutType === transportCardTypes.BOM_ESCOLAR ||
        transportCard.layoutType ===
          transportCardTypes.BOM_ESCOLAR_GRATUIDADE ||
        transportCard.layoutType === transportCardTypes.BOM_VT ||
        transportCard.layoutType === transportCardTypes.BOM_VT_EXPRESS
    );

    //CARTÃO LEGAL
    const hasLEGAL = data.find(
      transportCard => transportCard.layoutType === transportCardTypes.LEGAL
    );

    const Container = ui.error ? View : ScrollView;
    const containerStyles = [styles.content, contentStyle];

    return (
      <Container
        horizontal
        showsHorizontalScrollIndicator={false}
        style={StyleSheet.flatten([
          ...(ui.error ? containerStyles : []),
          style
        ])}
        contentContainerStyle={StyleSheet.flatten(
          ui.error ? [] : containerStyles
        )}
      >
        <View style={StyleSheet.flatten([styles.item, styles.add])}>
          <TransportCardBadge type="ADD" onPress={onAddPress} />
          <BrandText style={styles.itemText}>Adicionar cartão</BrandText>
        </View>
        {this.renderList()}
        {!hasBOM && !ui.isFetching && !ui.error && (
          <View style={styles.item}>
            <TransportCardBadge
              type="ADD_BOM"
              onPress={() => {
                onAddPress(issuerTypes.BOM);
              }}
            />
            <BrandText
              style={StyleSheet.flatten([
                styles.itemText,
                styles.itemTextEmpty
              ])}
            >
              Adicionar BOM
            </BrandText>
          </View>
        )}
        {!hasBU && !ui.isFetching && !ui.error && (
          <View style={styles.item}>
            <TransportCardBadge
              type="ADD_BU"
              onPress={() => {
                onAddPress(issuerTypes.BU);
              }}
            />
            <BrandText
              style={StyleSheet.flatten([
                styles.itemText,
                styles.itemTextEmpty
              ])}
            >
              Adicionar Bilhete Único
            </BrandText>
          </View>
        )}
        {!hasLEGAL && !ui.isFetching && !ui.error && (
          <View style={styles.item}>
            <TransportCardBadge
              type="ADD_LEGAL"
              onPress={() => {
                onAddPress(issuerTypes.LEGAL);
              }}
            />
            <BrandText
              style={StyleSheet.flatten([
                styles.itemText,
                styles.itemTextEmpty
              ])}
            >
              Adicionar Cartão Legal
            </BrandText>
          </View>
        )}
      </Container>
    );
  }
}

TransportCardBadgesList.propTypes = propTypes;
TransportCardBadgesList.defaultProps = defaultProps;

export default TransportCardBadgesList;
