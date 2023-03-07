// NPM imports
import React, { Component } from 'react';
import { StyleSheet, View, Platform, BackHandler } from 'react-native';

// VouD imports
import BrandText from '../../components/BrandText';
import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import { openUrl } from '../../utils/open-url';
import { colors } from '../../styles/constants';

// Component
class UnsupportedVersionDialogView extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this._backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._backHandler);
  }

  _backHandler = () => {
    return true;
  };

  _openStore = () => {
    if (Platform.OS === 'ios') {
      // openUrl("itms://itunes.apple.com/br/app/voud/id1325804882?mt=8");
      openUrl('itms://apps.apple.com/br/app/voud/id1325804882');
    } else {
      openUrl('market://details?id=br.com.autopass.voud');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Dialog noPadding onDismiss={() => {}}>
          <View style={styles.unsupportedTextContainer}>
            <BrandText style={styles.unsupportedTitleText}>Nova versão disponível</BrandText>
            <BrandText style={styles.unsupportedText}>
              Uma nova versão do app está disponível para você. Baixe agora para ter o acesso
              completo.
            </BrandText>
          </View>
          <Button style={styles.button} onPress={this._openStore}>
            Atualizar agora
          </Button>
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
    paddingVertical: 24,
    paddingHorizontal: 16,
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
  button: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
});

export const UnsupportedVersionDialog = UnsupportedVersionDialogView;
