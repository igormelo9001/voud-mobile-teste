import React, { Component } from 'react';
import { Platform, ScrollView, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../styles';

const { width, height } = Dimensions.get('window');

const styles = {
	fullScreen: {
		width: width,
		height: height
	},
	container: {
		backgroundColor: 'transparent',
		position: 'relative'
	},
	slide: {
		backgroundColor: 'transparent',
		width: width
	},
	pagination: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		backgroundColor: 'transparent'
	},
	dot: {
		backgroundColor: 'rgba(0,0,0,.25)',
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 3
	},
	activeDot: {
		backgroundColor: colors.BRAND_PRIMARY
	},
	buttonWrapper: {
		backgroundColor: 'transparent',
		flexDirection: 'column',
		position: 'absolute',
		bottom: 0,
		left: 0,
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 40,
		justifyContent: 'flex-end',
		alignItems: 'center'
	}
};

class Swiper extends Component {
	static propTypes = {
		horizontal: PropTypes.bool,
		pagingEnabled: PropTypes.bool,
		showsHorizontalScrollIndicator: PropTypes.bool,
		showsVerticalScrollIndicator: PropTypes.bool,
		bounces: PropTypes.bool,
		scrollsToTop: PropTypes.bool,
		removeClippedSubviews: PropTypes.bool,
		automaticallyAdjustContentInsets: PropTypes.bool,
		index: PropTypes.number,
		children: PropTypes.array,
		style: PropTypes.object
	};

	static defaultProps = {
		horizontal: true,
		pagingEnabled: true,
		showsHorizontalScrollIndicator: false,
		showsVerticalScrollIndicator: false,
		bounces: false,
		scrollsToTop: false,
		removeClippedSubviews: true,
		automaticallyAdjustContentInsets: false,
		index: 0,
		children: []
	};

	constructor(props) {
		super(props);

		const total = props.children ? props.children.length / 2 || 1 : 0,
			index = total > 1 ? Math.min(props.index, total - 1) : 0,
			offset = width * index;

		this.state = {
			total,
			index,
			offset,
			width,
			height
		};

		this.internals = {
			isScrolling: false,
			offset
		};
	}

	onScrollBegin = () => {
		this.internals.isScrolling = true;
	};

	onScrollEnd = (e) => {
		this.internals.isScrolling = false;

		this.updateIndex(
			e.nativeEvent.contentOffset ? e.nativeEvent.contentOffset.x : e.nativeEvent.position * this.state.width
		);
	};

	onScrollEndDrag = (e) => {
		const { contentOffset: { x: newOffset } } = e.nativeEvent,
			{ children } = this.props,
			{ index } = this.state,
			{ offset } = this.internals;

		if (offset === newOffset && (index === 0 || index === children.length / 2 - 1)) {
			this.internals.isScrolling = false;
		}
	};

	updateIndex = (offset) => {
		const state = this.state,
			diff = offset - this.internals.offset,
			step = state.width;
		let index = state.index;

		if (!diff) {
			return;
		}

		index = parseInt(index + Math.round(diff / step), 10);

		this.internals.offset = offset;
		this.setState({
			index
		});
	};

	swipe = () => {
		if (this.internals.isScrolling || this.state.total < 2) {
			return;
		}

		const state = this.state,
			diff = this.state.index + 1,
			x = diff * state.width,
			y = 0;

		this.scrollView && this.scrollView.scrollTo({ x, y, animated: true });

		this.internals.isScrolling = true;

		if (Platform.OS === 'android') {
			setImmediate(() => {
				this.onScrollEnd({
					nativeEvent: {
						position: diff
					}
				});
			});
		}
	};

	renderScrollView = (pages) => {
		const contents = [];
		const head = [];
		const body = [];

		pages.map((page, i) => {
			const isList = i % 2 === 0;
			!isList && body.push(page);
			isList && head.push(page);
		});

		for (let index = 0; index < pages.length / 2; index++) {
			contents.push(
				<View style={[ styles.slide ]} key={index}>
					{head[index]}
					{this.renderPagination()}
					{body[index]}
				</View>
			);
		}
		return (
			<ScrollView
				ref={(component) => {
					this.scrollView = component;
				}}
				{...this.props}
				contentContainerStyle={[ styles.wrapper, this.props.style ]}
				onScrollBeginDrag={this.onScrollBegin}
				onMomentumScrollEnd={this.onScrollEnd}
				onScrollEndDrag={this.onScrollEndDrag}
			>
				{contents}
			</ScrollView>
		);
	};

	renderPagination = () => {
		if (this.state.total <= 1) {
			return null;
		}

		const ActiveDot = <View style={[ styles.dot, styles.activeDot ]} />,
			Dot = <View style={styles.dot} />;

		let dots = [];

		for (let key = 0; key < this.state.total; key++) {
			dots.push(
				key === this.state.index ? React.cloneElement(ActiveDot, { key }) : React.cloneElement(Dot, { key })
			);
		}

		return (
			<View pointerEvents="none" style={[ styles.pagination]}>
				{dots}
			</View>
		);
	};

	render = ({ children } = this.props) => {
		return <View style={[ styles.container ]}>{this.renderScrollView(children)}</View>;
	};
}

export default Swiper;
