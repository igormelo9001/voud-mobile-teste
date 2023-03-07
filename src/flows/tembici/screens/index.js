import React, { Component, Fragment } from 'react';
import { Text, View, Platform, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import VoudModal from '../../../components/Modal/index';
import Moment from 'moment';

import BrandText from '../../../components/VoudText';
import Button from '../../../components/Button';
import { openUrl } from '../../../utils/open-url';

import icBike from '../../../images/ic-bike.png';
import icDoc from '../../../images/ic-doc.png';

class Tembici extends Component {
	openApp = async () => {
		const appStoreLink = 'https://itunes.apple.com/br/app/bike-ita%C3%BA/id1270864475?mt=8';
		const googlePlayLink = 'https://play.google.com/store/apps/details?id=pbsc.cyclefinder.tembici&hl=pt_BR';

		const deepLink = 'bikesampa://';
		
		try {
			await openUrl(deepLink);
		} catch (error) {
			if (Platform.OS === 'ios' && appStoreLink) {
				await openUrl(appStoreLink);
			}
			if (Platform.OS === 'android' && googlePlayLink) {
				await openUrl(googlePlayLink);
			}
		}
		dispatch(NavigationActions.back());
	};

	onCloseNotification = async () => {
		const { dispatch } = this.props;

		dispatch(NavigationActions.back());
	};

	render() {
		const { navigation } = this.props;
		const pointName = navigation.getParam('pointName');
		
		const num_bikes_available = navigation.getParam('num_bikes_available');
		const num_docks_available = navigation.getParam('num_docks_available');
		const last_reported = navigation.getParam('last_reported');

		const date = Moment.unix(last_reported).toDate();

		const hour = date.getHours();
		const min = date.getMinutes() < 10 ? "0" + date.getMinutes(): date.getMinutes();
		return (
			<Fragment>
				<VoudModal
					isVisible={true}
					style={styles.containerModal}
					animationIn="fadeIn"
					animationOut="fadeOut"
					onSwipe={this.onCloseNotification}
					onBackdropPress={this.onCloseNotification}
					backdropOpacity={0.3}
				>
					<View style={styles.modal}>
						<View style={{ margin: 16, alignItems: 'center' }}>
							<View style={{justifyContent: 'center'}}>
								<Text style={{ fontSize: 14, paddingTop: 8, fontWeight: 'bold' }}>
									{pointName}
								</Text>
								<Text style={{paddingBottom: 8, fontSize: 14 }}> {`Última atualização às ${hour}:${min}`}</Text>
							</View>
							<View style={styles.header}>
								<View style={styles.headerItem}>
									<Image
										source={icBike}
										style={{ alignSelf: 'center', padding: 5, marginLeft: 8, marginRight: 8 }}
									/>
									<BrandText style={{ fontSize: 24, fontWeight: 'bold' }}>
										{num_bikes_available}
									</BrandText>
								</View>
								<View
									style={{
										borderWidth: 1,
										borderColor: '#EAEAEA',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								/>
								<View style={styles.headerItem}>
									<Image
										source={icDoc}
										style={{ alignSelf: 'center', padding: 5, marginLeft: 8, marginRight: 8 }}
									/>
									<BrandText style={{ fontSize: 24, fontWeight: 'bold' }}>
										{num_docks_available}
									</BrandText>
								</View>
							</View>
						</View>
						<Button onPress={this.openApp} style={{ padding: 16 }}>
							Desbloquear
						</Button>
					</View>
				</VoudModal>
			</Fragment>
		);
	}
}

// Styles
const styles = {
	containerModal: {
		flexDirection: 'column'
	},
	modal: {
		backgroundColor: 'white',
		borderRadius: 8,
	},
	header: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#EAEAEA',
		justifyContent: 'center',
		alignItems: 'stretch',
		marginTop: 8,
		padding: 16,
		borderRadius: 4
	},
	headerItem: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 18,
		minWidth: 100
	}
};

export default connect()(Tembici);
