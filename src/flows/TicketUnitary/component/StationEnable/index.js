import React from "react";

import { View } from "react-native";

import styles from "./style";
import VoudText from "../../../../components/VoudText";
import SystemText from "../../../../components/SystemText";

const StationEnable = props => {
  const { name, description, type, color, number } = props.item;
  return (
    <View style={styles.container}>
      <View style={styles.containerRow}>
        <View style={styles.containerNumberLine}>
          <View style={[styles.circleLine, { backgroundColor: color }]}>
            <VoudText style={styles.number}>{number}</VoudText>
          </View>
        </View>
        <View style={styles.containerStation}>
          <SystemText style={styles.station}>{name}</SystemText>
          <SystemText style={styles.line}>{description}</SystemText>
        </View>
        <View style={styles.containerType}>
          <SystemText style={styles.type}>{type}</SystemText>
        </View>
      </View>
      <View style={styles.containerBar} />
    </View>
  );
};

export default StationEnable;
