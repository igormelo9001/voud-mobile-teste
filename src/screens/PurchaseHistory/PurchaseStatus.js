// NPM imports
import React from 'react';
import { View, StyleSheet } from 'react-native';

import BrandText from '../../components/BrandText';

import { colors } from '../../styles';

// Screen component
const PurchaseStatus = ({ currentStatus, maxStatus, labels }) => {

  const _getStatusLabelText = i => (
    StyleSheet.flatten([i <= currentStatus ? styles.labelTextDone : styles.labelText,
      labels.length === 1 ? styles.singleStatusLabelText : {}])
  );

  const renderCircles = () => {
    let circleList = [];
    for (let i = 1; i <= maxStatus; i++) {

      if (labels && labels.length > 0) {
        let labelIndex = i - 1;
        let labelText = labels[labelIndex] ? labels[labelIndex] : "";

        circleList.push(
          <View key={i}>
            <View style={i <= currentStatus ? styles.circleDone : styles.circle}>
            </View>
            <BrandText style={_getStatusLabelText(i)}>{labelText}</BrandText>
          </View>
        );
      } else {
        circleList.push(<View key={i} style={i <= currentStatus ? styles.circleDone : styles.circle}></View>);
      }

      i !== maxStatus && circleList.push(<View key={`${i}c`} style={styles.dash} />);
    }

    return circleList;
  };

  return (
    <View style={(labels && labels.length > 0) ? styles.circlesContainerLabels : styles.circlesContainer}>
      {renderCircles()}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  circlesContainer: {
    flexDirection: 'row',
    height: 16,
    justifyContent: 'center'
  },
  circlesContainerLabels: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center'
  },
  dash: {
    flex: 1,
    height: 2,
    marginTop: 7,
    marginBottom: 7,
    backgroundColor: colors.GRAY_LIGHT
  },
  circle: {
    position: 'relative',
    height: 16,
    width: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.GRAY_LIGHT,
    borderRadius: 50,
    backgroundColor: 'white'
  },
  circleDone: {
    position: 'relative',
    height: 16,
    width: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.BRAND_SUCCESS,
    borderRadius: 50,
    backgroundColor: colors.BRAND_SUCCESS
  },
  labelsContainer: {
    flexDirection: 'row',
    marginTop: 8
  },
  labelText: {
    width: 70,
    position: 'absolute',
    top: 24,
    left: -27,
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.GRAY_LIGHT,
  },
  labelTextDone: {
    width: 70,
    position: 'absolute',
    top: 24,
    left: -27,
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.GRAY_DARKER,
  },
  singleStatusLabelText: {
    width: 120,
    left: -50,
  }
});

export default PurchaseStatus;
