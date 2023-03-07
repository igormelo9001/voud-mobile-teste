import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import BrandText from '../../../components/BrandText';
import VoudText from '../../../components/VoudText';
import Icon from '../../../components/Icon';
import { colors } from '../../../styles';
import TouchableNative from '../../../components/TouchableNative';
import { formatCurrency } from '../../../utils/parsers-formaters';

const propTypes = {
	style: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ]),
	onPress: PropTypes.func,
	discountValue: PropTypes.number,
};

const defaultProps = {
	style: {}
};

const styles = {
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 16,
		paddingTop: 16,
		borderColor: colors.GRAY_LIGHTER,
		borderTopWidth: 1,
		borderBottomWidth: 1
	},
	Text: {
		borderColor: colors.GRAY_LIGHTER
	},
	PromocodeText: {
		borderColor: colors.GRAY_LIGHTER
	},
	Icon: {
		borderColor: colors.GRAY_LIGHTER
	},
	new: {
		paddingHorizontal: 5,
		marginHorizontal: 5,
		borderRadius: 2,
	},
	newText: {
		fontSize: 14,
		color: 'white'
	},
	discountText: { flexDirection: 'row', alignItems: 'center' }
};

const PromocodeField = (props) => {
	const { style, discountValue } = props;

	const item = !discountValue ? (
		<View style={StyleSheet.flatten([ styles.container, style ])}>
			<BrandText style={styles.Text}> Inserir código promocional </BrandText>
			<Icon style={styles.icon} name="arrow-forward" size={24} color={colors.BRAND_PRIMARY} />
		</View>
	) : (
		<View style={StyleSheet.flatten([ styles.container, style ])}>
			<BrandText style={styles.Text}>Código promocional</BrandText>
			<View style={styles.discountText}>
				<LinearGradient
					style={styles.new}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
					colors={[ '#f39200', '#fdc300' ]}
				>
					<VoudText style={styles.newText}> {formatCurrency(props.discountValue)}</VoudText>
				</LinearGradient>
				<Icon style={styles.icon} name="delete" size={24} color={colors.GRAY_LIGHT} />
			</View>
		</View>
	);

	return <TouchableNative onPress={props.onPress}>{item}</TouchableNative>;
};
PromocodeField.defaultProps = defaultProps;
PromocodeField.propTypes = propTypes;

export default PromocodeField;
