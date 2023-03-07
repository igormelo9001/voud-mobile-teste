import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import VoudText from '../../../../../components/VoudText';
import ContentPlaceholder from '../../../../../components/ContentPlaceholder';
import { colors } from '../../../../../styles';
import RequestError from '../../../../../components/RequestError';
import ResultSearchRouteListItem from './ResultSearchRouteListItem';


class ResultSearchRouteList extends Component {
  constructor(props) {
    super(props);
  }

  _renderResultSearchRouteListItem = ({ item, index }) => {
    const { routeSearch: { data: journey }, onToggleRouteInfoModal } = this.props;
    const { routes } = journey;
    return (
      <ResultSearchRouteListItem
        onPress={() => onToggleRouteInfoModal(item)}
        item={item}
        isLast={index === routes.length - 1}
      />
    );
  }

  render() {
    const { routeSearch: { data: journey, isFetching, error }, onRetry } = this.props;
    const { routes } = journey;
    const isEmptyList = routes ? (routes.length === 0) : true;

    if (isFetching) {
      return (
        <View style={styles.routeListContainer}>
          <VoudText style={styles.listTitle}>Sugestões de rotas</VoudText>
          <View style={styles.placeholderContainer}>
            <ContentPlaceholder
              duration={1000}
              style={styles.placeholderLeft}
            />
            <ContentPlaceholder
              duration={1000}
              style={styles.placeholderMiddle}
            />
            <View style={styles.placeholderWrapperRight}>
              <ContentPlaceholder
                duration={1000}
                style={styles.placeholderRightTop}
              />
              <ContentPlaceholder
                duration={1000}
                style={styles.placeholderRightBottom}
              />
            </View>
          </View>
        </View>
      )
    }
    if (
      !isFetching
      && routes
      && !isEmptyList
      && error === ''
    ) {
      return (
        <View style={styles.routeListContainer}>
          <View style={styles.routeListHeader}>
            <VoudText style={styles.listTitle}>Sugestões de rotas</VoudText>
          </View> 
          <FlatList
            data={routes}
            renderItem={this._renderResultSearchRouteListItem}
            keyExtractor={(item, index) => index}
          />
        </View>
      )
    }
    if (!isFetching && error !== '') {
      return (
        <View style={styles.routeListContainer}>
          <RequestError
            style={StyleSheet.flatten([styles.requestErrorContainer, isEmptyList ? styles.mt0 : {}])}
            error={error}
            onRetry={onRetry}
          />
        </View>
      )
    }
    return (
      <View style={StyleSheet.flatten([styles.routeListContainer, styles.emptyState])}>
        <VoudText style={styles.emptyStateText}>
          Não encontramos nenhuma rota para sua jornada.
        </VoudText>
      </View>
    )
  }
}

// Styles
const styles = StyleSheet.create({
  requestErrorContainer: {
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mt0: {
    marginTop: 0,
  },
  emptyState: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.GRAY
  },
  listTitle: {
    fontSize: 12,
    color: colors.GRAY,
    fontWeight: 'bold',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 16,
  },
  routeListContainer: {
    flex: 1,
  },
  routeListHeader: {
    backgroundColor: colors.GRAY_LIGHTEST,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_LIGHT2,
  },
  placeholderLeft: {
    flex: 2,
    height: 32,
    marginRight: 4,
  },
  placeholderMiddle: {
    flex: 1,
    height: 32,
    marginRight: 4,
  },
  placeholderWrapperRight: {
    flex: 7,
  },
  placeholderRightTop: {
    flex: 2,
    marginBottom: 4,
  },
  placeholderRightBottom: {
    flex: 1,
  },
  placeholderContainer: {
    paddingLeft: 16, 
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
  }
});

export default ResultSearchRouteList;
