import React, { Component } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';

import { colors } from '../../../../styles';
import TouchableText from '../../../../components/TouchableText';
import VoudText from '../../../../components/VoudText';
import ResultSearchListItem from './ResultSearchListItem';
import { TYPES } from '../SwitchTypeSearch';
import ContentPlaceholder from '../../../../components/ContentPlaceholder';
import RequestError from '../../../../components/RequestError';

class ResultSearchList extends Component {
	constructor(props) {
		super(props);
	}

	_renderResultSearchListItem = ({ item }) => {
		const { onSearchItemDetail, selectedSearchType } = this.props;
		return (
			<ResultSearchListItem
				type={selectedSearchType}
				onPress={() => {
					onSearchItemDetail(item);
				}}
				data={item}
			/>
		);
	};

	render() {
		const { searchTerm = '', resultSearchData, selectedSearchType, onFetchSearch } = this.props;
		const isEmptyList = resultSearchData.data.length === 0;
		if (!resultSearchData.isFetching && resultSearchData.error === '' && resultSearchData.reachedEnd == false) {
			return (
				<View style={styles.emptyState}>
					<VoudText style={styles.emptyStateText}>
						{selectedSearchType === TYPES.TRANSPORT ? (
							'Busque por linhas de ônibus, metrô e trem por números ou nomes próximos a você.'
						) : (
							'Busque por pontos de recarga próximos a você.'
						)}
					</VoudText>
				</View>
			);
		}

		if (!resultSearchData.isFetching && resultSearchData.error === '' && isEmptyList) {
			return (
				<View style={styles.emptyState}>
					<VoudText style={styles.emptyStateText}>Nenhum resultado encontrado para {searchTerm}.</VoudText>
				</View>
			);
		}

		return (
			<ScrollView keyboardShouldPersistTaps="always">
				<View style={styles.listWrapper}>
					{selectedSearchType === TYPES.POINTS &&
					resultSearchData.error === '' && <VoudText style={styles.listTitle}>Mais próximos a você</VoudText>}
					<FlatList
						data={resultSearchData.data}
						renderItem={this._renderResultSearchListItem}
						keyExtractor={(item) => item.id}
						keyboardShouldPersistTaps="always"
					/>
					{!resultSearchData.isFetching &&
					resultSearchData.error == '' &&
					!resultSearchData.reachedEnd && (
						<TouchableText onPress={onFetchSearch} style={styles.nextPageButton}>
							Carregar mais
						</TouchableText>
					)}
					<View style={isEmptyList ? styles.mt40 : styles.mt0}>
						{resultSearchData.isFetching && (
							<View style={styles.placeholderContainer}>
								<ContentPlaceholder duration={1000} style={styles.placeholderLeft} />
								<ContentPlaceholder duration={1000} style={styles.placeholderRight} />
							</View>
						)}
						{!resultSearchData.isFetching &&
						resultSearchData.error !== '' && (
							<RequestError
								style={StyleSheet.flatten([
									styles.requestErrorContainer,
									isEmptyList ? styles.mt0 : {}
								])}
								error={resultSearchData.error}
								onRetry={onFetchSearch}
							/>
						)}
					</View>
				</View>
			</ScrollView>
		);
	}
}

// Styles
const styles = StyleSheet.create({
	listWrapper: {
		flex: 1
	},
	listTitle: {
		fontSize: 12,
		color: colors.GRAY,
		fontWeight: 'bold',
		marginTop: 16,
		marginBottom: 8,
		paddingLeft: 16
	},
	emptyState: {
		justifyContent: 'center',
		alignContent: 'center',
		paddingVertical: 48,
		paddingHorizontal: 16
	},
	emptyStateText: {
		textAlign: 'center',
		fontSize: 14,
		color: colors.GRAY
	},
	nextPageButton: {
		marginVertical: 24,
		marginHorizontal: 16
	},
	placeholderContainer: {
		height: 56,
		backgroundColor: 'white',
		paddingHorizontal: 16,
		paddingVertical: 14,
		flexDirection: 'row',
		borderRadius: 2
	},
	placeholderLeft: {
		flex: 1,
		marginRight: 112
	},
	placeholderRight: {
		width: 40
	},
	requestErrorContainer: {
		marginVertical: 24,
		marginHorizontal: 16
	},
	mt40: {
		marginTop: 40
	},
	mt0: {
		marginTop: 0
	}
});

export default ResultSearchList;
