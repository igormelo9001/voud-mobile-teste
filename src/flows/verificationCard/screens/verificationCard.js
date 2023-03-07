import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Header, { headerActionTypes } from '../../../components/Header';
import { getPaddingForNotch } from '../../../utils/is-iphone-with-notch';
import { colors } from '../../../styles';
import cardVerification from '../../../images/verification-card/card_verify_success.png';
import SystemText from '../../../components/SystemText';
import Button from '../../../components/Button';
import { GATrackEvent, GAEventParams } from '../../../shared/analytics';
import { navigateToRoute } from '../../../redux/nav';
import { routeNames } from '../../../shared/route-names';
import { verifyPaymentCardAction } from '../store/ducks/verificationCard';
import Loader from '../../../components/Loader';
import { GetFontSizeRatio } from '../../../utils/font-size';

const fontSizeRatio = GetFontSizeRatio();

const styles = {
	mainContainer: {
		flex: 1,
		paddingBottom: getPaddingForNotch(),
		backgroundColor: 'white'
	},
	scrollView: {
		flex: 1
	},
	titleStyle: {
		textAlign: 'center',
		color: colors.YELLOW
	},
	textAverageSize: {
		fontSize: fontSizeRatio.FONT_AVERAGE
	},
	textMinSize: {
		fontSize: fontSizeRatio.FONT_MIN
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
		alignSelf: 'center',
		alignContent: 'center',
		alignItems: 'center',
		padding: 16
	}
};

const TITLE_HEADER = 'Verficar Cartão';

class VerificationCardView extends Component {
	openVerificationCardConfirmationScreen = () => {
		const { dispatch } = this.props;
		const {
			categories: { BUTTON },
			actions: { CLICK },
			labels: { OPEN_VERIFICATION_CARD_CONFIRMATION }
		} = GAEventParams;
		GATrackEvent(BUTTON, CLICK, OPEN_VERIFICATION_CARD_CONFIRMATION);
		dispatch(navigateToRoute(routeNames.VERIFICATION_CARD_CONFIRMATION, {}));
	};

	initiateVerificationCard = () => {
		const { dispatch, paymentMethodToVerify } = this.props;
		dispatch(verifyPaymentCardAction(paymentMethodToVerify.id));
		setTimeout(() => {
			this.openVerificationCardConfirmationScreen();
		}, 300);
	};

	render() {
		const { dispatch, isFetching } = this.props;

		return (
			<View style={styles.mainContainer}>
				<Header
					title={TITLE_HEADER}
					titleStyle={styles.titleStyle}
					customContainerStyle={{ elevation: 0 }}
					left={{
						type: headerActionTypes.BACK,
						onPress: () => dispatch(NavigationActions.back())
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
							Faremos uma pequena cobrança entre R$ 0,01 e R$ 0,99 em seu cartão. Em seguida pediremos que
							confirme qual valor foi cobrado.
						</SystemText>

						<SystemText style={[ styles.textMinSize, { paddingTop: 10 } ]}>
							Não se preocupe, a cobrança será estornada após a verificação.
						</SystemText>
					</View>
				</ScrollView>
				<View style={styles.containerButton}>
					<Button onPress={this.initiateVerificationCard} style={styles.styleButton}>
						INICIAR VERIFICAÇÃO
					</Button>
				</View>
				<View style={styles.containerText}>
					<SystemText style={styles.textMinSize}>
						Se não tiver acesso à sua fatura no momento, confirme o valor assim que puder e retorne a essa
						tela para informá-lo.
					</SystemText>
				</View>
			</View>
		);
	}
}

// Redux
const mapStateToProps = ({ verificationCard: { paymentMethodToVerify, verificationCard } }) => {
	return {
		paymentMethodToVerify,
		isVerificationInitiated:
			verificationCard && verificationCard.verifyCard && verificationCard.verifyCard.isVerificationInitiated
	};
};

const VerificationCard = connect(mapStateToProps)(VerificationCardView)

export default VerificationCard;
