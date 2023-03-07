// NPM Imports
import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

// VouD Imports
import TouchableNative from '../../../components/TouchableNative';
import VoudText from '../../../components/VoudText';
import Icon from '../../../components/Icon';
import { colors } from '../../../styles';
import { TYPES } from './SwitchTypeSearch';

// Component
class Suggestions extends Component {

  _filterType = (type) => {
    this.props.handleSearchTypeChange(type);
  }

  render() {
    return (
      <View style={styles.suggestions}>

        <VoudText style={styles.suggestionsTitle}>Sugestões</VoudText>

        <TouchableNative
            onPress={() => { this._filterType(TYPES.ROUTES) }}
            style={styles.suggestionsItem}
          >
          <View style={styles.suggestionWrapper}>
            <Icon
              name="pin"
              style={styles.suggestionsIcon}
            />
            <VoudText style={styles.suggestionsTypeTitle}>Pesquisar em rotas e trajetos por </VoudText>
            <VoudText
              style={styles.suggestionsSerchTerm}
              ellipsizeMode={'tail'} numberOfLines={1}>
              {this.props.searchTerm}
            </VoudText>
          </View>
        </TouchableNative>

        <TouchableNative
            onPress={() => { this._filterType(TYPES.TRANSPORT) }}
            style={styles.suggestionsItem}
          >
          <View style={styles.suggestionWrapper}>
            <Icon
              name="bus"
              style={styles.suggestionsIcon}
            />
            <VoudText style={styles.suggestionsTypeTitle}>Pesquisar em ônibus, metrôs e trens por </VoudText>
            <VoudText
              style={styles.suggestionsSerchTerm}
              ellipsizeMode={'tail'} numberOfLines={1}>
              {this.props.searchTerm}
            </VoudText>
          </View>
        </TouchableNative>

        <TouchableNative
            onPress={() => { this._filterType(TYPES.POINTS) }}
            style={styles.suggestionsItem}
          >
          <View style={styles.suggestionWrapper}>
            <Icon
              name="validator"
              style={styles.suggestionsIcon}
            />
            <VoudText style={styles.suggestionsTypeTitle}>Pesquisar em pontos de recarga por </VoudText>
            <VoudText
              style={styles.suggestionsSerchTerm}
              ellipsizeMode={'tail'} numberOfLines={1}>
              {this.props.searchTerm}
            </VoudText>
          </View>
        </TouchableNative>

      </View>
    )
  }
}

// Styles
const styles = StyleSheet.create({
  suggestions: {
    flexDirection: 'column'
  },
  suggestionsTitle: {
    fontSize: 12,
    color: colors.GRAY,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 16,
  },
  suggestionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    backgroundColor: 'white'
  },
  suggestionWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHT2,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56
  },
  suggestionsIcon: {
    fontSize: 24,
    color: colors.GRAY_LIGHT,
    marginRight: 8
  },
  suggestionsTypeTitle: {
    fontSize: 12,
    color: colors.GRAY,
  },
  suggestionsSerchTerm: {
    fontSize: 12,
    color: colors.GRAY,
    fontWeight: 'bold',
    flex: 1
  }
});

export default Suggestions;