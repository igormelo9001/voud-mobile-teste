// NPM Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image } from 'react-native';

// VouD Imports
import TouchableNative from '../../../../components/TouchableNative';
import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import { issuerTypes } from '../../../../redux/transport-card';
import { TYPES } from '../SwitchTypeSearch';
import { formatNumber } from '../../../../utils/parsers-formaters';
import { voudCapitalizeLetters } from '../../../../utils/string-util';

// PropTypes
const propTypes = {
	onPress: PropTypes.func.isRequired
};

// component
const bomLogoImg = require('../../../../images/transport-cards/bom.png');
const buLogoImg = require('../../../../images/transport-cards/bu.png');

// Component
class ResultSearchListItem extends Component {
	_renderPointsImage = (data) => {
		if (!data.acceptedCards) return null;
		return data.acceptedCards.map((el, index) => (
			<Image
				key={el}
				source={el === issuerTypes.BU ? buLogoImg : bomLogoImg}
				style={
					data.acceptedCards.length === 1 ? (
						styles.bigImg
					) : (
						StyleSheet.flatten([
							styles.img,
							el === issuerTypes.BU ? styles.buImg : styles.bomImg,
							index === data.acceptedCards.length - 1 ? styles.mb0 : {}
						])
					)
				}
				resizeMode="contain"
			/>
		));
	};

	_renderTransportLinesItem = () => {
		const { data, onPress } = this.props;
		const description = data && data.description ? data.description : '';
		const lineNumber = data && data.lineNumber ? data.lineNumber : '';

		return (
			<TouchableNative onPress={onPress} key={data.id} style={styles.resultSearchListItem}>
				<View style={styles.itemWrapper}>
					<View style={styles.transportLineContentLeft}>
						<VoudText style={styles.lineNumber}>{lineNumber}</VoudText>
						<VoudText style={styles.title}>{voudCapitalizeLetters(description)}</VoudText>
					</View>
					<View style={styles.contentRight}>{this._renderPointsImage(data)}</View>
				</View>
			</TouchableNative>
		);
	};

	_renderRechargePointsItem = () => {
		const { data, onPress } = this.props;
		const name = data && data.name ? data.name : '';
		const address = data && data.description ? data.description : data.shortAddress ? data.shortAddress : '';
		const distance = data && data.distance ? data.distance : '';

		return (
			<TouchableNative onPress={onPress} key={data.id} style={styles.resultSearchListItem}>
				<View style={styles.itemWrapper}>
					<View style={styles.rechargePointContainerLeft}>
						<VoudText style={styles.rechargePointName}>{voudCapitalizeLetters(name)}</VoudText>
						<VoudText style={styles.rechargePointAddress}>{voudCapitalizeLetters(address)}</VoudText>
					</View>
					<View style={styles.contentRight}>
						<VoudText style={styles.rechargePointDistance}>{`${formatNumber(distance, 1)} km`}</VoudText>
						{this._renderPointsImage(data)}
					</View>
				</View>
			</TouchableNative>
		);
	};

	render() {
		const { type } = this.props;
		return type === TYPES.TRANSPORT ? this._renderTransportLinesItem() : this._renderRechargePointsItem();
	}
}

ResultSearchListItem.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
	resultSearchListItem: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 56,
		paddingHorizontal: 16,
		backgroundColor: 'white'
	},
	itemWrapper: {
		borderBottomWidth: 1,
		borderBottomColor: colors.GRAY_LIGHTER,
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 56
	},
	contentRight: {
		alignItems: 'center'
	},
	title: {
		flex: 1,
		fontSize: 12,
		color: colors.GRAY_DARK
	},
	img: {
		width: 20,
		marginBottom: 8
	},
	bigImg: {
		width: 24,
		height: 24
	},
	bomImg: {
		height: 10
	},
	buImg: {
		height: 19
	},
	transportLineContentLeft: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		marginRight: 16
	},
	lineNumber: {
		fontSize: 12,
		color: colors.GRAY_DARK,
		fontWeight: '600',
		width: 60,
		marginRight: 8
	},
	rechargePointContainerLeft: {
		flex: 1,
		paddingVertical: 12,
		marginRight: 16
	},
	rechargePointName: {
		fontSize: 12,
		color: colors.GRAY_DARK,
		lineHeight: 16,
		fontWeight: '600'
	},
	rechargePointAddress: {
		fontSize: 10,
		color: colors.GRAY,
		lineHeight: 16
	},
	rechargePointDistance: {
		fontSize: 12,
		color: colors.GRAY_DARK,
		lineHeight: 16,
		fontWeight: '600'
	},
	mb0: {
		marginBottom: 0
	}
});

export default ResultSearchListItem;
