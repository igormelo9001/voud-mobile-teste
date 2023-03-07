// NPM imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, PanResponder, StyleSheet, View } from 'react-native';

// VouD imports
import { colors } from '../styles';
import TouchableOpacity from './TouchableOpacity';
import Progress from './Progress';

// Component
const propTypes = {
	noHandle: PropTypes.bool,
	startCollapsed: PropTypes.bool,
	expandedHeight: PropTypes.number, // prevents content flash when startCollapsed is true
	collapseOffset: PropTypes.number,
	onToggle: PropTypes.func,
	renderCollapsibleContent: PropTypes.func,
	renderFixedContent: PropTypes.func,
	style: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ]),
	type: PropTypes.oneOf([ 'card', 'scooter', 'rentCar',  'requestCard' ])
};

const defaultProps = {
	noHandle: false,
	startCollapsed: false,
	expandedHeight: 0,
	collapseOffset: 0,
	onToggle: () => {},
	renderCollapsibleContent: null,
	renderFixedContent: null,
	style: {},
	type: 'card'
};

class CollapsibleCard extends Component {
	constructor(props) {
		super(props);
		const { startCollapsed, type, expandedHeight } = props;

		this.state = {
			collapsed: startCollapsed,
			animValue: new Animated.Value(startCollapsed ? 1 : 0),
			animCardValues: {
				card: new Animated.Value((startCollapsed && type == 'card') || type !== 'card' ? 1 : 0),
				scooter: new Animated.Value((startCollapsed && type == 'scooter') || type !== 'scooter' ? 1 : 0),
        rentCar: new Animated.Value((startCollapsed && type == 'rentCar') || type !== 'rentCar' ? 1 : 0),
        requestCard: new Animated.Value((startCollapsed && type == 'requestCard') || type !== 'requestCard' ? 1 : 0),
			},
			collapsibleHeight: expandedHeight,
			type
		};

		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				// The number "4" is just a good tradeoff to make the panResponder
				// work correctly even when the modal has touchable buttons.
				// For reference:
				// https://github.com/react-native-community/react-native-modal/pull/197
				return Math.abs(gestureState.dy) >= 4;
			},
			onPanResponderMove: (evt, gestureState) => {
				if (!this.state.collapsed) {
					this.state.animValue.setValue(
						gestureState.dy / (this.state.collapsibleHeight - props.collapseOffset)
					);
				} else {
					this.state.animValue.setValue(
						1 + gestureState.dy / (this.state.collapsibleHeight - props.collapseOffset)
					);
				}
			},
			onPanResponderRelease: (evt, gestureState) => {
				if (Math.abs(gestureState.dy) > (this.state.collapsibleHeight - props.collapseOffset) * 0.3) {
					this.toggle();
				} else {
					this.animate(this.state.type);
				}
			}
		});
	}

	animate = (type) => {
		let toValue = this.state.collapsed ? 0 : 1;
		const viewAnim = this.animateHandle(toValue);

		if (!this.state.collapsed && this.state.type !== type) {
			const cardAnim = this.animateByType(this.state.type, toValue);

			const view2Anim = this.animateHandle(0);
			const card2Anim = this.animateByType(type, 0);

			Animated.parallel([ viewAnim, cardAnim ], { useNativeDriver: true }).start(() => {
				this.setState({ collapsed: false, type });
				this.props.onToggle(false, type);
				Animated.parallel([ view2Anim, card2Anim ]).start();
			});
		} else {
			const cardAnim = this.animateByType(type, toValue);
			Animated.parallel([ viewAnim, cardAnim ], { useNativeDriver: true }).start();
		}
	};

	animateHandle = (toValue) => {
		const viewAnim = Animated.timing(this.state.animValue, {
			toValue,
			easing: Easing.in(Easing.cubic),
			duration: 400
		});

		return viewAnim;
	};

	animateByType = (type, toValue) => {
		const { animCardValues } = this.state;
		let fromValue;
		switch (type) {
			case 'card':
				fromValue = animCardValues.card;
				break;
			case 'scooter':
				fromValue = animCardValues.scooter;
				break;
			case 'rentCar':
				fromValue = animCardValues.rentCar;
        break;
        case 'requestCard':
				fromValue = animCardValues.requestCard;
				break;

			default:
				break;
		}

		const cardAnim = Animated.timing(fromValue, {
			toValue,
			easing: Easing.in(Easing.cubic),
			duration: 400
		});

		return cardAnim;
	};

	toggle = (type) => {
		const { onToggle } = this.props;
		const { collapsed } = this.state;

		if (!type) type = this.state.type;

		this.animate(type);
		if (this.state.collapsed || this.state.type === type) {
			this.setState({ collapsed: !collapsed, type });
			onToggle(!collapsed, type);
		}
	};

	setCollapsibleHeight = ({ nativeEvent: { layout } }) => {
		this.setState({ collapsibleHeight: layout.height });
	};

	render() {
		const {
			noHandle,
			collapseOffset,
			renderCollapsibleContent,
			renderFixedContent,
			style,
			showProgressBar,
			isMenuService,
			renderFixedButtonContent
		} = this.props;
		const { animValue, animCardValues, collapsibleHeight } = this.state;

		const collapsibleAnimStyle = {
			marginBottom: animValue.interpolate(
				{
					inputRange: [ 0, 1 ],
					outputRange: [ 0, collapseOffset - collapsibleHeight ],
					extrapolate: 'clamp'
				},
				{
					useNativeDriver: false
				}
			)
		};

		return (
			<View style={StyleSheet.flatten([ styles.container, style, showProgressBar ? styles.noBorderRadius : {} ])}>
				<Progress style={{ opacity: showProgressBar ? 1 : 0 }} withHeight />
				{isMenuService !== undefined && (
					<View {...this.panResponder.panHandlers}>
						<TouchableOpacity onPress={this.toggle} style={styles.handleArea}>
							<View style={styles.handle} />
						</TouchableOpacity>
					</View>
				)}

				{!noHandle && (
					<View {...this.panResponder.panHandlers}>
						<TouchableOpacity onPress={this.toggle} style={styles.handleArea}>
							<View style={styles.handle} />
						</TouchableOpacity>
					</View>
				)}
				{renderCollapsibleContent && (
					<Animated.View
						onLayout={this.setCollapsibleHeight}
						style={StyleSheet.flatten([ styles.collapsibleContent, collapsibleAnimStyle ])}
					>
						{renderCollapsibleContent(animValue, this.toggle)}
					</Animated.View>
				)}
				{isMenuService !== undefined && renderFixedButtonContent(this.toggle)}
				{renderFixedContent &&
				isMenuService === undefined && (
					<View style={styles.fixedContent}>
						{renderFixedContent(
							animCardValues.card,
							animCardValues.scooter,
              animCardValues.rentCar,
              animCardValues.requestCard,
							this.toggle
						)}
					</View>
				)}
			</View>
		);
	}
}

CollapsibleCard.propTypes = propTypes;
CollapsibleCard.defaultProps = defaultProps;

// Styles
const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
		backgroundColor: 'white',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		shadowColor: 'black',
		shadowOpacity: 0.25,
		shadowRadius: 16,
		shadowOffset: {
			height: -2,
			width: 0
		},
		elevation: 16
	},
	handleArea: {
		alignSelf: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 8
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.GRAY_LIGHT
	},
	collapsibleContent: {
		alignSelf: 'stretch'
	},
	fixedContent: {
		alignSelf: 'stretch',
		backgroundColor: 'white'
	},
	noBorderRadius: {
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0
	}
});

export default CollapsibleCard;
