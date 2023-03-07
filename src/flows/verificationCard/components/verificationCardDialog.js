import React, { Component } from 'react';
import { View, Image } from 'react-native';

import VoudModal from '../../../components/Modal';
import { colors } from '../../../styles';
import SystemText from '../../../components/SystemText';
import cardVerification from '../../../images/verification-card/card_verify_success.png';
import Button from '../../../components/Button';
import { GetFontSizeRatio } from '../../../utils/font-size';

const fontSizeRatio = GetFontSizeRatio();

const styles = {
	modal: {
		margin: 0,
		padding: 16, 
	},
	container: {
		padding: 16,
		backgroundColor: colors.BRAND_PRIMARY,
		alignContent: 'stretch',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	containerButton: {
		padding: 16,
		backgroundColor: colors.WHITE,
	},
	styleButton: { paddingHorizontal: 16, borderRadius: 4 },
	containerText: {
		backgroundColor: colors.WHITE,
		alignItems: 'center',
		paddingVertical: 16,
	},
	highlightText: { 
		padding: 16, 
		fontSize: 16, 
		color: colors.YELLOW, 
		marginBottom: 16, 
	},
	textAverageSize: {
		fontSize: fontSizeRatio.FONT_AVERAGE
	},
	textMinSize: {
		fontSize: fontSizeRatio.FONT_MIN
	},
	
};

export default class VerificationCardDialog extends Component {
	render() {
		const { isVisible, dismissDialog, onPressVerificationCard } = this.props;
		return (
			<VoudModal
				style={styles.modal}
				isVisible={isVisible}
				onSwipe={dismissDialog}
				onBackdropPress={dismissDialog}
				swipeDirection="down"
				backdropOpacity={0.3}
			>
				<View style={{backgroundColor: colors.WHITE}}>
					<View style={styles.container}>
						<SystemText style={styles.highlightText}>Verificar cartão</SystemText>
						<Image style={{ marginBottom: 16,}} source={cardVerification} />
					</View>
					<View
						style={styles.containerText}
					>
						<SystemText style={styles.textMinSize}>Cartões não verificados têm limites</SystemText>
						<SystemText style={styles.textMinSize}>diários de recarga. A verificação é um</SystemText>
						<SystemText style={styles.textMinSize}>processo rápido e muito importante</SystemText>
						<SystemText style={styles.textMinSize}>para a sua segurança</SystemText>
					</View>
					<View
						style={styles.containerButton}
					>
						<Button onPress={onPressVerificationCard} style={styles.styleButton}>
							VERIFICAR AGORA
						</Button>

						<Button
							onPress={dismissDialog}
							style={{ paddingHorizontal: 16 }}
							outline={'white'}
							outlineText={'primary'}
							textStyle={{fontSize: 11}}
						>
							VERIFICAR DEPOIS
						</Button>
					</View>
				</View>
			</VoudModal>
		);
	}
}
