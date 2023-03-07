import React, { Component } from 'react';
import { Platform, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../../../../components/Icon';
import ButtonIcon from '../ButtonIcon';
import VoudTouchableOpacity from '../../../../components/TouchableOpacity';
import { colors } from '../../../../styles';
import { uuidv4 } from '../../../../utils/uuid-util';

const styles = {
	centerPosition: {
		alignItems: 'flex-end',
		marginBottom: Platform.OS === 'android' ? 8 : 16,
		marginRight: Platform.OS === 'android' ? 8 : 16,
		padding: Platform.OS === 'android' ? 8 : 0
	},

	centerPositionIconContainer: {
		backgroundColor: 'white',
    borderRadius:  40 / 2,
    height: 40,
    width: 40,
		padding: 8,
		elevation: 5,
		shadowColor: 'rgba(0, 0, 0, 0.25)',
		shadowOpacity: 1,
		shadowRadius: 6,
		shadowOffset: {
			height: 2,
			width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
	},
	icon: {
		fontSize: 22,
		color: colors.BRAND_PRIMARY
	},

	isSelected: {
		borderColor: colors.BRAND_PRIMARY,
		borderWidth: 1
	}
};

const CAR = 'car';
const BUS = 'bus';
const BIKE = 'bike';
const SCOO = 'scoo';

const CURRENT_LOCATION = 'currentLocation';

export default class SwitcherTransportModel extends Component {
	static propTypes = {
		models: PropTypes.string,
		onPressBike: PropTypes.func,
		onPressBus: PropTypes.func,
		onPressCar: PropTypes.func,
		onPressScoo: PropTypes.func,
		isZazcar: PropTypes.bool,
		isTembici: PropTypes.bool,
		isBus: PropTypes.bool,
		isScoo: PropTypes.bool,
		toastPosition: PropTypes.object,
		onCenterLocation: PropTypes.func,
		isServiceMenuCollapsed: PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedModel: CURRENT_LOCATION,
			carOpacity: new Animated.Value(1),
			busOpacity: new Animated.Value(1),
			scooOpacity: new Animated.Value(1),
			bikeOpacity: new Animated.Value(1)
		};
	}

	renderButtonModels = () => {
		const {
			models,
			onPressBike,
			onPressBus,
			onPressCar,
			onPressScoo,
			isZazcar,
			isTembici,
			isBus,
			isScoo,
			isServiceMenuCollapsed
		} = this.props;

		return models.split('|').map((model) => {
			switch (model) {
				case CAR:
					if (!isZazcar && !isServiceMenuCollapsed) return null;
					return (
						<Animated.View
							style={StyleSheet.flatten([ { opacity: this.state.carOpacity } ])}
							pointerEvents="box-none"
							key={uuidv4()}
						>
							<ButtonIcon
								key={uuidv4()}
								style={StyleSheet.flatten([
									{
										paddingBottom: 5,
										elevation: 5
									}
								])}
								wrapperButton={isZazcar ? styles.isSelected : {}}
								onPress={onPressCar}
								icon={'car'}
								badge={false}
							/>
						</Animated.View>
					);
				case BUS:
					if (!isBus && !isServiceMenuCollapsed) return null;
					return (
						<Animated.View
							style={StyleSheet.flatten([ { opacity: this.state.busOpacity } ])}
							pointerEvents="box-none"
							key={uuidv4()}
						>
							<ButtonIcon
								key={uuidv4()}
								style={{
									paddingBottom: 5,
									elevation: 5
								}}
								wrapperButton={isBus ? styles.isSelected : {}}
								onPress={onPressBus}
								icon={'bus'}
								badge={false}
							/>
						</Animated.View>
					);
				case BIKE:
					if (!isTembici && !isServiceMenuCollapsed) return null;
					return (
						<Animated.View
							style={StyleSheet.flatten([ { opacity: this.state.bikeOpacity } ])}
							pointerEvents="box-none"
							key={uuidv4()}
						>
							<ButtonIcon
								key={uuidv4()}
								style={{
									paddingBottom: 5,
									elevation: 5
								}}
								wrapperButton={isTembici ? styles.isSelected : {}}
								onPress={onPressBike}
								icon={'ic-tembici'}
								badge={false}
							/>
						</Animated.View>
					);
				case SCOO:
					if (!isScoo && !isServiceMenuCollapsed) return null;

					return (
						<Animated.View
							style={StyleSheet.flatten([ { opacity: this.state.scooOpacity } ])}
							pointerEvents="box-none"
							key={uuidv4()}
						>
							<ButtonIcon
								key={uuidv4()}
								style={{
									paddingBottom: 5,
									elevation: 5
								}}
								wrapperButton={isScoo ? styles.isSelected : {}}
								onPress={onPressScoo}
								icon={'scooter'}
								badge={false}
							/>
						</Animated.View>
					);
				default:
					return null;
			}
		});
	};

	getButtonStyle = () => {
		const { selectedModel } = this.state;
		const { centerPositionIconContainer } = styles;
		let style = {};
		switch (selectedModel) {
			case CURRENT_LOCATION:
				style = centerPositionIconContainer;
				break;
			case BIKE:
				style = {};
				break;
			case CAR:
				style = {};
				break;
			case BUS:
				style = {};
				break;

			default:
				break;
		}
		return style;
	};

	animatingOpacity = (op, modal, isCollapsed) => {
		Animated.timing(op, {
			toValue: modal && !isCollapsed ? 1 : isCollapsed ? 1 : 0,
			duration: 50
		}).start();
	};

	animatedSwitchmodal = () => {
		const { isServiceMenuCollapsed, isBus, isZazcar, isScoo, isTembici } = this.props;
		const { carOpacity, busOpacity, bikeOpacity, scooOpacity } = this.state;

		this.animatingOpacity(busOpacity, isBus, isServiceMenuCollapsed);
		this.animatingOpacity(carOpacity, isZazcar, isServiceMenuCollapsed);
		this.animatingOpacity(scooOpacity, isScoo, isServiceMenuCollapsed);
		this.animatingOpacity(bikeOpacity, isTembici, isServiceMenuCollapsed);
	};

	render() {
		const { toastPosition, onCenterLocation } = this.props;
		this.animatedSwitchmodal();
		return (
			<Animated.View
				style={StyleSheet.flatten([ styles.centerPosition, { bottom: toastPosition } ])}
				pointerEvents="box-none"
				key={uuidv4()}
			>
				{this.renderButtonModels()}
				<VoudTouchableOpacity onPress={onCenterLocation} style={this.getButtonStyle()}>
					<Icon style={styles.centerPositionIcon} color={colors.BRAND_PRIMARY} name="my-location" size={20} />
				</VoudTouchableOpacity>
			</Animated.View>
		);
	}
}
