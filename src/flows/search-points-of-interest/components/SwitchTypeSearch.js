// npm imports
import React, { Component } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

// VouD imports
import VoudText from "../../../components/VoudText";

// util
import { colors } from "../../../styles";
import TouchableNative from "../../../components/TouchableNative";

export const TYPES = {
  ROUTES: "routes",
  TRANSPORT: "transport",
  POINTS: "points"
};

class SwitchTypeSearch extends Component {
  _isSelected(type) {
    return this.props.selectedSearchType === type;
  }

  _onPress = type => {
    if (type === this.props.selectedSearchType) {
      this.props.onSearchTypeChange("");
      return;
    }

    this.props.onSearchTypeChange(type);
  };

  _renderGradient = () => (
    <LinearGradient
      colors={[colors.BRAND_PRIMARY_DARKER, colors.BRAND_PRIMARY_LIGHT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.linearGradient}
    />
  );

  render() {
    return (
      <View style={StyleSheet.flatten([styles.container, this.props.style])}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <TouchableNative
            onPress={() => {
              this._onPress(TYPES.ROUTES);
            }}
            style={styles.button}
          >
            {this._isSelected(TYPES.ROUTES) && this._renderGradient()}
            <VoudText
              style={[
                styles.text,
                this._isSelected(TYPES.ROUTES) && styles.textActive
              ]}
            >
              Rotas e trajetos
            </VoudText>
          </TouchableNative>

          <TouchableNative
            onPress={() => {
              this._onPress(TYPES.TRANSPORT);
            }}
            style={styles.button}
          >
            {this._isSelected(TYPES.TRANSPORT) && this._renderGradient()}
            <VoudText
              style={[
                styles.text,
                this._isSelected(TYPES.TRANSPORT) && styles.textActive
              ]}
            >
              Ônibus e metrôs
            </VoudText>
          </TouchableNative>

          <TouchableNative
            onPress={() => {
              this._onPress(TYPES.POINTS);
            }}
            style={styles.button}
          >
            {this._isSelected(TYPES.POINTS) && this._renderGradient()}
            <VoudText
              style={[
                styles.text,
                this._isSelected(TYPES.POINTS) && styles.textActive
              ]}
            >
              Pontos de recarga
            </VoudText>
          </TouchableNative>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: colors.GRAY_LIGHTEST,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 0
    },
    elevation: 8,
    zIndex: 0
  },
  scrollContainer: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    height: 58,
    padding: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: colors.GRAY_LIGHTER,
    marginRight: 8,
    ...Platform.select({
      ios: {
        padding: 5
      },
      android: {
        padding: 8
      }
    })
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    borderRadius: 4
  },
  text: {
    color: colors.GRAY,
    fontSize: 10,
    ...Platform.select({
      ios: {
        margin: 0
      },
      android: {
        margin: 8
      }
    })
  },
  textActive: {
    color: "white"
  }
});

export default connect()(SwitchTypeSearch);
