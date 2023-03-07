// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

// VouD imports
import BrandText from '../BrandText';
import Icon from '../Icon';
import { TRANSPORT_CARD_HEIGHT } from './';

// Component
const propTypes = {
  children: PropTypes.node.isRequired,
  cardHeight: PropTypes.number,
  onReady: PropTypes.func,
  onRefresh: PropTypes.func,
  style: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
};

const defaultProps = {
  cardHeight: TRANSPORT_CARD_HEIGHT,
  onReady: () => {},
  onRefresh: () => {},
  style: {},
}

class PullToRefreshContainer extends React.Component {
  constructor(props) {
    super(props);

    this.scrollViewRef = null;
    this.animY = new Animated.Value(40);
    this.scrollPos = 0;

    this.refreshAnimStyle = {
      opacity: this.animY.interpolate({
        inputRange: [0, 40],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: this.animY.interpolate({
            inputRange: [0, 40],
            outputRange: [0, 16],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  componentDidMount() {
    // we use setTimeout because of Android rendering rules
    // (scrollTo doesn't work in didMount)
    setTimeout(() => {
      this.scrollViewRef && this.scrollViewRef.scrollTo({ y: 40, animated: true });
    }, 100);
  }

  onScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
    this.scrollPos = y;
  };

  checkRefresh = () => {
    if (this.scrollPos < 8) {
      setTimeout(() => { this.props.onRefresh(); }, 100)
    }
    this.scrollViewRef && this.scrollViewRef.scrollTo({ y: 40, animated: true });
  };

  renderRefreshText = () => (
    <Animated.View style={StyleSheet.flatten([styles.refreshControl, this.refreshAnimStyle])}>
      <Icon
        style={styles.refreshIcon}
        name="refresh"
      />
      <BrandText style={styles.refreshText}>Solte para atualizar</BrandText>
    </Animated.View>
  );

  render() {
    const { children, cardHeight, style } = this.props;

    return (
      <View style={style}>
        {this.renderRefreshText()}
        <ScrollView
          ref={(el) => { this.scrollViewRef = el; }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.animY } } }],
            { listener: this.onScroll },
          )}
          onScrollEndDrag={this.checkRefresh}
          style={{ height: cardHeight }}
          contentContainerStyle={StyleSheet.flatten([styles.scrollView, { height: cardHeight + 40 }])}
        >
          {children}
        </ScrollView>
      </View>
    );
  }
}

PullToRefreshContainer.propTypes = propTypes;
PullToRefreshContainer.defaultProps = defaultProps;

const styles = StyleSheet.flatten({
  refreshControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
  },
  refreshIcon: {
    marginRight: 8,
    fontSize: 16,
    color: 'white'
  },
  refreshText: {
    fontSize: 12,
    color: 'white'
  },
  scrollView: {
    paddingTop: 40,
  },
});

export default PullToRefreshContainer;
