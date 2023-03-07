import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Image, Text, BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Header, { headerActionTypes } from '../../../components/Header';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';
import { colors } from '../../../styles';
import cardVerification from '../../../images/verification-card/card_verify_value.png';
import SystemText from '../../../components/SystemText';
import Button from '../../../components/Button';
import VoudTextInput from '../../../components/TextInput';
import { formatCurrencyFromCents, unformatFromCents } from '../../../utils/parsers-formaters';
import VoudTouchableOpacity from '../../../components/TouchableOpacity';
import {
	changeVerificationValue,
	verifyPaymentCardAction,
	verifyPaymentCardConfirmAction,
	verifyPaymentCardConfirmClear
} from '../store/ducks/verificationCard';
import { routeNames } from '../../../shared/route-names';
import { navigateToRoute, backToRoute } from '../../../redux/nav';
import moment from 'moment';
import { verificationStatusType } from '../components/types';
import Loader from '../../../components/Loader';
import { GetFontSizeRatio } from '../../../utils/font-size';

const fontSizeRatio = GetFontSizeRatio();

const styles = {
	mainContainer: {
		flex: 1,
		paddingBottom: getPaddingForNotch(),
		backgroundColor: 'white'
	},
	textAverageSize: {
		fontSize: fontSizeRatio.FONT_AVERAGE
	},
	textMinSize: {
		fontSize: fontSizeRatio.FONT_MIN
	},
	scrollView: {
		flex: 1
	},
	titleStyle: {
		textAlign: 'center',
		color: colors.YELLOW
	},
	container: {
		padding: 16,
		backgroundColor: colors.BRAND_PRIMARY,
		alignContent: 'stretch',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	containerButton: {
		padding: 16,
		backgroundColor: colors.WHITE
	},
	containerText: {
		backgroundColor: colors.WHITE,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16
	},
	input: { fontSize: 32, color: colors.GRAY_LIGHT3 },
	bold: { fontWeight: 'bold' },
	row: { flexDirection: 'row' }
};

const FIXED_VALUE = 'R$ ';
const KEYBOARD_TYPE = 'numeric';
const TITLE_HEADER = 'Verficar Cartão';

class VerificationCardConfirmationView extends Component {
	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this._backHandler);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
	}

	_redirectOnFinishing = () => {
		const { dispatch, isInitiateCardVerify } = this.props;

		if (isInitiateCardVerify()) {
			dispatch(backToRoute(routeNames.PAYMENT_METHODS));
		} else {
			dispatch(NavigationActions.back());
		}
	};

	_backHandler = () => {
		this._redirectOnFinishing();
		return true;
	};

	onChangeText = (value) => {
		const { dispatch } = this.props;
		dispatch(changeVerificationValue(value));
	};

	openVerificationCardHandlerFeedBack = (success) => {
		const { dispatch } = this.props;
		dispatch(
			navigateToRoute(routeNames.VERIFICATION_CARD_CONFIRMATION_FEEDBACK, {
				success
			})
		);
	};

	confirmValueInvoice = () => {
		const { dispatch, verificationValue, paymentMethodToVerify } = this.props;
		if (!verificationValue) return;
		dispatch(verifyPaymentCardConfirmAction(paymentMethodToVerify.id, unformatFromCents(verificationValue)));
	};

	cancelVerificationCardProcess = () => {
		const { dispatch, paymentMethodToVerify } = this.props;
		if (!paymentMethodToVerify) return;
		dispatch(verifyPaymentCardAction(paymentMethodToVerify.id, true));

		setTimeout(() => {
			this._redirectOnFinishing();
		}, 300);
	};

	clearAndNavigateCardConfirmation = (isCardConfirmed) => {
		const { dispatch } = this.props;
		dispatch(verifyPaymentCardConfirmClear());
		dispatch(changeVerificationValue(0));
		this.openVerificationCardHandlerFeedBack(isCardConfirmed);
	};

	validateConfirmAndNavigate = (isCardConfirmed, count) => {
		if (!isCardConfirmed && count < 3) return;
		if (isCardConfirmed) {
			this.clearAndNavigateCardConfirmation(isCardConfirmed);
		} else if (!isCardConfirmed && count >= 3) {
			this.clearAndNavigateCardConfirmation(isCardConfirmed);
		}
	};

	renderLink = () => {
		return (
			<VoudTouchableOpacity onPress={this.cancelVerificationCardProcess}>
				<Text style={styles.bold}> clique aqui.</Text>
			</VoudTouchableOpacity>
		);
	};

	render() {
		const {
			isCardConfirmed,
			returnMessage,
			verificationValue,
			paymentMethodToVerify,
			countConfirm,
			isFetching
		} = this.props;
		const { items: { finalDigits } } = paymentMethodToVerify;
		this.validateConfirmAndNavigate(isCardConfirmed(), countConfirm());

		const date = moment(new Date()).local().format('DD/MM/YYYY');

		return (
			<View style={styles.mainContainer}>
				<Header
					title={TITLE_HEADER}
					titleStyle={styles.titleStyle}
					customContainerStyle={{ elevation: 0 }}
					left={{
						type: headerActionTypes.BACK,
						onPress: this._redirectOnFinishing
					}}
					right={null}
				/>
				<ScrollView>
					{isFetching && <Loader text={loadingMessage || 'Carregando...'} />}

					<View style={styles.container}>
						<Image style={{ marginBottom: 16 }} source={cardVerification} />
					</View>
					<View style={styles.containerText}>
						<SystemText style={styles.textMinSize}>
							Fizemos uma pequena cobrança no seu cartão de crédito (final {finalDigits}) no dia {date}.
							Confira a sua fatura e informe no campo abaixo o valor cobrado.
						</SystemText>
					</View>
					<View style={styles.containerButton}>
						<View>
							<VoudTextInput
								autoFocus
								largeField
								onChangeText={this.onChangeText}
								style={styles.input}
								value={formatCurrencyFromCents(verificationValue)}
								maxLength={8}
								fixedValue={FIXED_VALUE}
								keyboardType={KEYBOARD_TYPE}
								underlineColorAndroid={colors.GRAY_LIGHT3}
								placeholderTextColor={colors.GRAY_LIGHT3}
							/>
							{!isCardConfirmed() && (
								<Text style={{ color: colors.BRAND_ERROR, alignSelf: 'center', padding: 16 }}>
									{returnMessage()}
								</Text>
							)}
						</View>
						<Button onPress={this.confirmValueInvoice} style={styles.styleButton}>
							CONFIRMAR VALOR
						</Button>
					</View>
					<View style={styles.containerText}>
						<SystemText style={styles.textMinSize}>
							Caso a verificação não seja finalizada o valor será estornado em 7 dias.
						</SystemText>
						<View style={styles.row}>
							<SystemText style={styles.textMinSize}> Caso queira cancelar a verificação</SystemText>{this.renderLink()}
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

// Redux
const mapStateToProps = ({
	verificationCard: { verificationValue, paymentMethodToVerify, verifyCardConfirm, verifyCard }
}) => {
	return {
		verificationValue,
		paymentMethodToVerify,
		countConfirm: () => {
			if (verifyCardConfirm && verifyCardConfirm.error) {
				const { payload: { countConfirm } } = verifyCardConfirm.error;
				return countConfirm;
			}
			return 0;
		},

		returnMessage: () => {
			if (verifyCardConfirm && verifyCardConfirm.error) {
				const { returnMessage } = verifyCardConfirm.error;
				return returnMessage;
			}
		},
		isCardConfirmed: () => {
			if (verifyCardConfirm && verifyCardConfirm.data) {
				const { returnCode } = verifyCardConfirm.data;
				return returnCode == 0;
			}
			if (verifyCardConfirm && verifyCardConfirm.error) {
				const { returnMessage, payload: { verificationStatus } } = verifyCardConfirm.error;
				returnMessagePayload = returnMessage;
				return verificationStatus == verificationStatusType.VERIFIED;
			}
			return false;
		},
		isInitiateCardVerify: () => {
			if (verifyCard && verifyCard.data) {
				const { returnCode } = verifyCard.data;
				return returnCode == 0;
			}
			return false;
		}
	};
};

const VerificationCardConfirmation = connect(mapStateToProps)(VerificationCardConfirmationView);

export default VerificationCardConfirmation;
