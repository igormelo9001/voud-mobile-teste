// NPM imports
import React from 'react';
import {
	StyleSheet,
	View
} from 'react-native';
import { pipe } from 'ramda';

// VouD imports
import SystemText from '../SystemText';
import { formatCurrency } from '../../utils/parsers-formaters';

// Component imports
import SecondaryInfo from './SecondaryInfo';
import { walletApplicationId } from '../../redux/transport-card';
import { appendIf } from '../../utils/fp-util';

// Component
const BomVTExpressContent = ({ data, collapse, small }) => {

	const cardWallets = data.wallets ? data.wallets : [];
	const vtApplication = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_VT);
	const vtExpressApplication = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_VT_EXPRESS);
	const comumApplication = cardWallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_COMUM);

	const renderSecondary = () => {
		const balanceNextRecharge = data.balanceNextRecharge;
		if (balanceNextRecharge > 0)
			return <SecondaryInfo
				value={balanceNextRecharge}
				collapse={collapse}
				icon="validate-bom-card"
			/>
	};

	const _getBalance = (application) => {
		return formatCurrency(application ? application.balance : 0);
	}

	const _getCardContainerStyle = pipe(
		() => [styles.container],
		appendIf(styles.containerSmall, small),
		StyleSheet.flatten,
	)

	return (
		<View style={_getCardContainerStyle()}>
			<View style={styles.row}>
				<View style={StyleSheet.flatten([styles.col, { marginLeft: 0 }])}>
					<SystemText
						style={styles.typeText}
						numberOfLines={2}
						ellipsizeMode={'tail'}
					>
						{ small && 'Vale-transporte'}
						{ !small && `Saldo${'\n'}Vale-transporte` }
          </SystemText>
					<SystemText style={styles.valueText}>
						<SystemText style={styles.currencyText}>R$ </SystemText>{_getBalance(vtApplication)}
					</SystemText>
				</View>
				<View style={styles.col}>
					<SystemText
						style={styles.typeText}
						numberOfLines={2}
						ellipsizeMode={'tail'}
					>
						{ small && 'VT Express'}
						{ !small && `Saldo${'\n'}VT Express` }
          </SystemText>
					<SystemText style={styles.valueText}>
						<SystemText style={styles.currencyText}>R$ </SystemText>{_getBalance(vtExpressApplication)}
					</SystemText>
				</View>
				<View style={styles.col}>
					<SystemText
						style={styles.typeText}
						numberOfLines={2}
						ellipsizeMode={'tail'}
					>
						{ small && 'Comum'}
						{ !small && `Saldo${'\n'}Comum` }
          </SystemText>
					<SystemText style={styles.valueText}>
						<SystemText style={styles.currencyText}>R$ </SystemText>{_getBalance(comumApplication)}
					</SystemText>
				</View>
			</View>
			{/* {renderSecondary()} */}
		</View>
	);
};

// styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16
	},
	containerSmall: {
		padding: 10
	},
	row: {
		flexDirection: 'row'
	},
	col: {
		flex: 1,
		marginLeft: 8
	},
	typeText: {
		fontSize: 10,
		fontWeight: 'bold'
	},
	valueText: {
		fontSize: 20,
		lineHeight: 24
	},
	currencyText: {
		fontSize: 10
	}
});

export default BomVTExpressContent;
