import React from "react";
import { View, StyleSheet } from "react-native";

// VouD imports
import { colors } from "../../../../../styles";
import Icon from "../../../../../components/Icon";

// Component
const Timeline = ({ isFirst, isLast, isTransparent }) => {
  const getTimelineStyles = () => {
    const timelineStyles = [styles.timeline];
    return StyleSheet.flatten(timelineStyles);
  };

  const renderIcon = () => {
    return (
      <View style={styles.entryIcon}>
        <Icon
          name="recarga-2"
          size={24}
          color={colors.BRAND_SECONDARY_DARKER}
        />
      </View>
    );
  };

  return (
    <View style={styles.timelineContainer}>
      <View style={getTimelineStyles()} />
      {renderIcon()}
    </View>
  );
};

const timelineIconTopOffset = 30;

const styles = {
  timelineContainer: {
    position: "relative",
    width: 45
  },
  entryIcon: {
    position: "absolute",
    backgroundColor: "#FFF",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    top: timelineIconTopOffset,
    // left: '50%',
    marginLeft: 10,
    borderRadius: 20
  },
  timeline: {
    position: "absolute",
    top: 0,
    bottom: 0,
    marginLeft: 27,
    borderLeftColor: colors.BRAND_PRIMARY,
    borderLeftWidth: 1
  },
  firstTimeline: {
    top: timelineIconTopOffset
  },
  lastTimeline: {
    height: timelineIconTopOffset,
    bottom: "auto"
  },
  transparent: {
    borderLeftColor: "transparent"
  }
};

export default Timeline;
