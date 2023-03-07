// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';

// VouD imports
import BrandText from '../../components/BrandText';
import Dialog from '../../components/Dialog';
import { colors } from '../../styles/constants';

// Component
class UnsupportedDeviceDialogView extends Component {

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    return true;
  };

  render() {
    const { navigation: { state: { params: { isRooted }}}} = this.props;

    return (
      <View style={styles.container}>
        <Dialog 
          noPadding
          onDismiss={() => {}}
        >
          <View style={styles.unsupportedTextContainer}>
            <BrandText
              style={styles.unsupportedTitleText}
            >
              {isRooted ? 'Dispositivo rooteado' : 'Dispositivo não suportado'}
            </BrandText>
            <BrandText
              style={styles.unsupportedText}
            >
              {`Por motivos de segurança, o VouD não funciona ${isRooted ? 'com dispositivos rooteados.' : 'no seu dispositivo.'}`}
            </BrandText>
          </View>
        </Dialog>
      </View>
    );
}
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unsupportedTextContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_LIGHTER,
    padding: 24
  },
  unsupportedTitleText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.BRAND_PRIMARY,
    marginBottom: 24,
  },
  unsupportedText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.GRAY,
  },
});

export const UnsupportedDeviceDialog = UnsupportedDeviceDialogView;
