import React, { Component } from 'react';
import { View } from 'react-native';

const styles = {
	dividerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},

	roundedRight: {
		width: 7,
		height: 14,
		opacity: 0.5,
		borderBottomLeftRadius: 15,
		borderTopLeftRadius: 15,
		backgroundColor: '#fff'
	},

	roundedLeft: {
		width: 7,
		height: 14,
		opacity: 0.5,
		borderBottomRightRadius: 15,
		borderTopRightRadius: 15,
		backgroundColor: '#fff'
	},

	dot: {
		flex: 1,
		height: 1,
		opacity: 0.5,
		backgroundColor: '#fff',
		marginLeft: 1,
		marginRight: 1
	}
};

export class Picote extends Component {
	renderDots = (max) => {
		if (max < 0) return null;
		let dots;
		for (let index = 0; index < max; index++) {
			dots = <View style={styles.dot} />;
		}

		return dots;
	};

	render() {
		return (
			<View style={styles.dividerContainer}>
				<View style={styles.roundedLeft} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.dot} />
				<View style={styles.roundedRight} />
			</View>
		);
	}
}

export default Picote;
