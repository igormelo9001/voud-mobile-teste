// NPM imports
import React, { Component } from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

// VouD imports
import SystemText from '../../components/SystemText';
import TouchableText from '../../components/TouchableText';
import Dialog from '../../components/Dialog';
import { colors } from '../../styles';

// Screen component
// TODO - unused image
// const bankLogos = [
//   require('../../images/bank-logos/bradesco.png'), require('../../images/bank-logos/itau.png'), require('../../images/bank-logos/bcoBrasil.png'),
//   require('../../images/bank-logos/hsbc.png'), require('../../images/bank-logos/citi.png'), require('../../images/bank-logos/santander.png'),
//   require('../../images/bank-logos/safra.png'), require('../../images/bank-logos/mercantil.png'), require('../../images/bank-logos/brb.png'),
//   require('../../images/bank-logos/bcoAmazonia.png'), require('../../images/bank-logos/bcoNordeste.png'),   require('../../images/bank-logos/bcoSpirit.png'),
//   require('../../images/bank-logos/bancoob.png'), require('../../images/bank-logos/sicredi.png')];

const propTypes = {};

class DebitCardSupportedBanksHelperDialogView extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      bankLogosRows: []
    };
  }

  componentWillMount() {
    // Three logos per row
    const bankLogosRows = bankLogos.reduce((acc, cur, index) => {
      if (index % 3 === 0) {
        acc.push([cur]);
      } else {
        acc[acc.length-1].push(cur);
      }
      return acc;
    }, []);
    this.setState({ bankLogosRows });
  }
  
  _dismiss = () => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.back());
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Dialog
          onDismiss={this._dismiss}
          noPadding
        >
          <SystemText style={styles.dialogTitle}>Bancos conveniados</SystemText>
          <ScrollView>
          {
            this.state.bankLogosRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.bankLogoRow}>
              {
                row.map((logoSource, itemIndex) => (
                  <Image 
                    key={logoSource}
                    source={logoSource} 
                    style={StyleSheet.flatten([styles.bankImg, itemIndex !== 2 ? styles.mr16 : {}])}
                  />
                ))
              }
              </View>
            ))
          }
          </ScrollView>
          <View style={styles.confirmTextContainer}>
            <View style={styles.spacing} />
            <TouchableText
                onPress={this._dismiss}
                textStyle={styles.confirmText}
                minHeightAuto
                useSysFont
              >
              OK
            </TouchableText>
          </View>
        </Dialog>
      </View>
    );
  }
}

DebitCardSupportedBanksHelperDialogView.propTypes = propTypes;

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dialogTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.GRAY_DARKER,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  bankLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bankImg: {
    height: 64,
    width: 64,
    borderWidth: 1,
    borderColor: colors.GRAY_LIGHT,
    borderRadius: 4,
  },
  mr16: {
    marginRight: 16
  },
  confirmTextContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  spacing: {
    flex: 1
  },
  confirmText: {
    color: colors.BRAND_PRIMARY,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 'bold'
  }
});



export const DebitCardSupportedBanksHelperDialog = connect()(DebitCardSupportedBanksHelperDialogView);
