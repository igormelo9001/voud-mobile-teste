import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import LinearGradient from 'react-native-linear-gradient';

import VoudText from '../../../../components/VoudText';
import { colors } from '../../../../styles';
import Icon from '../../../../components/Icon';

class BikeTooltip extends Component {
	
	wichColorShouldRender = (counter) => (counter > 0 ? [ 'rgba(94,205,76,1)', 'rgba(94,205,76,1)' ] : [ 'rgba(255,0,0,1)', 'rgba(255,0,0,1)' ]);

	render() {
		const { num_bikes_available, num_docks_available, pointName } = this.props;

		return (
			<LinearGradient
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				locations={[ 0, 0.92, 1 ]}
				colors={[ 'transparent', 'rgba(0,0,0,0.15)', 'transparent' ]}
				style={styles.tooltip}
			>
				<View style={styles.tooltipBody}>
					<View style={styles.container}>
						<View style={styles.tooltipContainer}>
							<View style={styles.tooltipTitle}>
								<VoudText style={{ margin: 5, fontSize: 14, fontWeight: 'bold' }}>{pointName}</VoudText>
							</View>
							<View style={styles.containerBikeAvailable}>
								<View style={styles.legendText}>
									<Icon
										style={{ marginRight: 5, color: colors.BRAND_PRIMARY }}
										name="ic-tembici"
										size={24}
									/>
									<VoudText>Bicicletas disponíveis</VoudText>
								</View>

								<LinearGradient
									start={{ x: 0, y: 0 }}
									end={{ x: 0, y: 0 }}
									colors={this.wichColorShouldRender(num_bikes_available)}
									style={styles.counter}
								>
									<VoudText style={styles.counterText}>{num_bikes_available}</VoudText>
								</LinearGradient>
							</View>
							<View style={styles.containerEmptyVacancy}>
								<View style={styles.legendText}>
									<Icon
										style={{ marginLeft: 5, marginRight: 10, color: colors.BRAND_PRIMARY }}
										name="ic-doc-tembici"
										size={24}
									/>
									<VoudText>Vagas vazias</VoudText>
								</View>
								<LinearGradient
									start={{ x: 0, y: 0 }}
									end={{ x: 0, y: 0 }}
									colors={this.wichColorShouldRender(num_docks_available)}
									style={styles.counter}
								>
									<VoudText style={styles.counterText}>{num_docks_available}</VoudText>
								</LinearGradient>
							</View>
						</View>

						<View style={{ alignItems: 'center', marginLeft: 5 }}>
							<Icon name="arrow-forward" size={24} />
						</View>
					</View>
				</View>
				<View style={styles.tooltipArrow} />
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	tooltip: {
		paddingBottom: 9,
		paddingHorizontal: 1
	},
	tooltipBody: {
		backgroundColor: 'white',
		borderRadius: 4,
		padding: 8,
		minWidth: 250
	},
	tooltipArrow: {
		backgroundColor: 'white',
		width: 9,
		height: 9,
		position: 'absolute',
		left: '47%',
		bottom: 4,
		transform: [ { rotate: '45deg' } ]
	},
	tooltipContainer: {
		flexDirection: 'column',
		flex: 1
	},
	tooltipTitle: {
		alignSelf: 'center',
		paddingTop: 5,
		paddingBottom: 5
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	containerBikeAvailable: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	containerEmptyVacancy: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	counter: {
		borderRadius: 4,
		width: 31,
		marginLeft: 5,
		alignSelf: 'center',
		height: 17
	},

	counterText: {
		alignSelf: 'center',
		fontSize: 12,
		color: 'white'
	},

	legendText: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginRight: 5
	}
});

BikeTooltip.propTypes = {
	acceptedCards: PropTypes.array,
	lineNumber: PropTypes.string,
	lineOrigin: PropTypes.string,
	lineDestiny: PropTypes.string
};
BikeTooltip.defaultProps = {};

export default BikeTooltip;
