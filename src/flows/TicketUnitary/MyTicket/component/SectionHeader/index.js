import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

// Group imports
import SystemText from "../../../../../components/SystemText";

const SectionHeader = ({ title }) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.sectionHeaderContainer}>
        <SystemText style={styles.sectionHeader}>{title}</SystemText>
      </View>
    </View>
  );
};

const styles = {
  mainContainer: {
    flexDirection: "row"
  },
  sectionHeaderContainer: {
    marginTop: 16,
    marginBottom: 8
  },
  sectionHeader: {
    color: "#A3A3A3",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 16
  }
};

// prop types
SectionHeader.propTypes = {
  title: PropTypes.string.isRequired
};

export default SectionHeader;
