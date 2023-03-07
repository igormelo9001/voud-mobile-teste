import React from 'react';
import { View, Easing, Image } from 'react-native';
import { connect } from 'react-redux';

import { colors } from '../../../styles';
import CardVerifySuccess from '../../../images/verification-card/card_verify_success.png';
import CardVerifyError from '../../../images/verification-card/card_verify_error.png';
import BrandText from '../../../components/BrandText';
import CircleTransition from '../../../components/CircleTransition';
import { routeNames } from '../../../shared/route-names';
import { backToRoute } from '../../../redux/nav';

const styles = {
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	text: { color: colors.WHITE, fontSize: 18, fontWight: 'bold' }
};

const VERIFIED_CARD = 'Cartão Verificado';
const NOT_VERIFIED_CARD = 'Cartão não verificado';

const TRANSITION_BUFFER = 3000;
const ANIMATION_DURATION = 2000;

const setTimeoutTransition = (dispatch, callback, nameRoute) => {
	setTimeout(() => {
		dispatch(callback(nameRoute));
	}, TRANSITION_BUFFER);
};

const VerificationCardHandlerFeedBackView = ({ navigation, dispatch }) => {
	const success = navigation.getParam('success');
	setTimeoutTransition(dispatch, backToRoute, routeNames.PAYMENT_METHODS);

	const backgroundColor = success ? colors.GREEN : colors.BRAND_ERROR;
	const image = success ? CardVerifySuccess : CardVerifyError;
	const message = success ? VERIFIED_CARD : NOT_VERIFIED_CARD;

	return (
		<CircleTransition
			color={backgroundColor}
			expand
			transitionBuffer={TRANSITION_BUFFER}
			duration={ANIMATION_DURATION}
			easing={Easing.linear}
			position={'center'}
		>
			<View style={styles.container}>
				<Image source={image} />
				<BrandText style={styles.text}>{message}</BrandText>
			</View>
		</CircleTransition>
	);
};

const VerificationCardHandlerFeedBack = connect()(VerificationCardHandlerFeedBackView);

export default VerificationCardHandlerFeedBack;
