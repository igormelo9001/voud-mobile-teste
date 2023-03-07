import React from "react";
import { View, Image, StyleSheet, Platform } from "react-native";

import SystemText from "../../../../components/SystemText";
import { colors } from "../../../../styles";

const imgLogoMetro = require("../../component/image/ico-metro.png");
const imgLogoCPTM = require("../../component/image/ico-cptm.png");

const imgLogoQrCode = require("../../component/image/qrcode.png");

const styles = StyleSheet.create({
  container: {
    marginTop: 16
  },
  containerCard: {
    height: 71,
    borderRadius: 6,
    marginLeft: 18,
    marginRight: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
    ...Platform.select({
      ios: {
        borderWidth: 0.5
      },
      android: {
        borderWidth: 0
      }
    })
  },
  containerCardInternal: {
    flexDirection: "row",
    flex: 1
  },
  containerLogo: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16
  },
  logo: {
    height: 39,
    width: 39,
    borderWidth: 0,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    height: 21,
    width: 176,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.BRAND_PRIMARY
  },
  containerTitle: {
    marginTop: 16,
    marginLeft: 8
  },
  description: {
    fontSize: 12,
    marginTop: 4
  },
  containerArrow: {
    marginTop: 27.67,
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    marginRight: 19.52
  },
  value: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 19,
    textAlign: "center"
  },
  containerValue: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const renderColorImage = type => {
  switch (type) {
    case "METRO":
      return { color: "#014382", image: imgLogoMetro };
    case "CPTM":
      return { color: "#E33338", image: imgLogoCPTM };

    default:
      return { color: "#6E3E91", image: undefined };
  }
};

const renderTitle = type => {
  if (type === "METRO") return "UNITÁRIO METRÔ";
  return "UNITÁRIO CPTM";
};

const PurchaseCardView = props => {
  const { type, value } = props;
  // const colorImage = renderColorImage(type);
  // const title = renderTitle(type);

  return (
    <View style={styles.container}>
      <View style={styles.containerCard}>
        <View style={styles.containerCardInternal}>
          <View style={styles.containerLogo}>
            {/* <View style={[styles.logo, { borderColor: colorImage.color }]}> */}
            <View style={styles.logo}>
              <Image source={imgLogoQrCode} resizeMode="contain" />
            </View>
          </View>
          <View style={styles.containerTitle}>
            <SystemText style={[styles.title]}>BILHETE QR CODE</SystemText>
            <SystemText style={styles.description}>
              Válido para uma passagem
            </SystemText>
          </View>
          <View style={styles.containerValue}>
            <SystemText style={styles.value}>{`R$ ${value}`}</SystemText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PurchaseCardView;
