import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import SystemText from "../../../components/SystemText";

const imgLogoMetro = require("./image/ico-metro.png");
const imgLogoCPTM = require("./image/ico-cptm.png");
const arrowForward = require("./image/arrow-forward.png");

const imgLogo = require("./image/qrcode.png");

const styles = StyleSheet.create({
  container: {
    marginTop: 16
  },
  containerCard: {
    height: 71,
    // borderWidth: 1,
    // borderColor: '#C0C0C0',
    borderRadius: 6,
    // marginLeft: 18,
    // marginRight: 18,
    backgroundColor: "#FFF"
  },
  containerCardInternal: {
    flexDirection: "row",
    flex: 1
  },
  containerLogo: {
    marginLeft: 19.22,
    marginTop: 19,
    marginBottom: 18,
    justifyContent: "flex-end"
  },
  logo: {
    // height: 39,
    // width: 39,
    // borderWidth: 1,
    // borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    height: 21,
    width: 176,
    fontSize: 16,
    fontWeight: "bold"
  },
  containerTitle: {
    marginTop: 16,
    marginLeft: 8
  },
  description: {
    fontSize: 14,
    marginTop: 0
  },
  containerArrow: {
    marginTop: 27.67,
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    marginRight: 19.52
  }
});

const CardView = props => {
  const { onPress } = props;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPress()} activeOpacity={0.9}>
        <View style={styles.containerCard}>
          <View style={styles.containerCardInternal}>
            <View style={styles.containerLogo}>
              <View style={[styles.logo]}>
                <Image source={imgLogo} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.containerTitle}>
              <SystemText style={[styles.title, { color: "#6E3E91" }]}>
                BILHETE QR CODE
              </SystemText>
              <SystemText style={styles.description}>
                {/* Válido para uma passagem */}
                {`Ticket: ${props.ticket}`}
              </SystemText>
            </View>
            <View style={styles.containerArrow}>
              <Image source={arrowForward} resizeMode="contain" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardView;
