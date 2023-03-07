import React from "react";
import { View, PixelRatio } from "react-native";
import Moment from "moment";

// VouD imports
import { colors } from "../../../../../styles";

import SystemText from "../../../../../components/SystemText";
import { formatCurrency } from "../../../../../utils/parsers-formaters";

// Group imports
import Timeline from "../Timeline";

const Item = ({ itemData }) => {
  const lineStation = itemData.transDetails
    ? itemData.transDetails.split(":")[1]
    : "";

  const formatEntryDate = () =>
    Moment(itemData.lastSync)
      .format("DD MMM")
      .toUpperCase();

  const renderEntryValue = () => {
    return (
      <SystemText style={styles.creditValue}>
        {`- R$ ${formatCurrency(itemData.saldo)}`}
      </SystemText>
    );
  };

  return (
    <View style={[styles.mainContainer]}>
      <Timeline isFirst={itemData.isFirst} isLast={itemData.isLast} />
      <View style={[styles.entryContainer]}>
        <View style={styles.entryDateContainer}>
          <SystemText style={styles.entryDate}>{formatEntryDate()}</SystemText>
        </View>
        <View style={[styles.entryDescriptionContainer]}>
          <View style={styles.entryDescriptionWrapper}>
            <SystemText style={styles.entryDescription}>Passagem</SystemText>
            <SystemText style={[styles.entryAdditionalInfo]}>
              {lineStation}
            </SystemText>
          </View>
          {renderEntryValue()}
        </View>
      </View>
    </View>
  );
};

const styles = {
  mainContainer: {
    alignItems: "stretch",
    flexDirection: "row",
    paddingRight: 16
  },
  // Entry
  entryContainer: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "stretch",
    borderBottomColor: colors.GRAY_LIGHTER,
    borderBottomWidth: 1
  },
  entryDateContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  entryDate: {
    color: "#A3A3A3",
    fontSize: 12,
    marginRight: 16,
    lineHeight: 14
  },
  entryCardTypeContainer: {
    justifyContent: "center",
    backgroundColor: colors.GRAY_LIGHT2,
    paddingHorizontal: 4,
    height: 16,
    borderRadius: 8
  },
  entryCardType: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.GRAY
  },
  entryDescriptionContainer: {
    flexDirection: "row"
  },
  entryDescription: {
    // flex: 1,
    color: colors.GRAY_DARKER,
    fontSize: 18,
    lineHeight: 19,
    fontWeight: "normal",
    height: 19,
    marginTop: 4,
    fontWeight: "bold"
  },
  entryDescriptionWrapper: {
    flex: 1
  },
  creditValue: {
    color: "#F94949",
    fontSize: 16,
    lineHeight: 19,
    marginLeft: 4,
    fontWeight: "bold"
  },
  debitValue: {
    color: colors.BRAND_ERROR,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 4
  },
  entryAdditionalInfo: {
    color: colors.GRAY,
    fontSize: PixelRatio.get() === 2 ? 13 : 14,
    lineHeight: 16,
    marginTop: 4
  }
};

export default Item;
