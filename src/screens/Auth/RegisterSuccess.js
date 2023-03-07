// NPM imports
import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

// VouD imports
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import BrandText from '../../components/BrandText';
import { colors } from '../../styles';
import FadeInView from '../../components/FadeInView';

// component
class RegisterSuccess extends Component {
  render() {
    const { onComplete } = this.props;

    return (
      <FadeInView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Icon
            style={styles.successIcon}
            name="checkmark-circle-outline"
          />
          <BrandText style={styles.successTitle}>
            Cadastro realizado com sucesso!
          </BrandText>
          <BrandText style={styles.thanksFeedback}>
            Agora você já pode incluir seu Bilhete Único e Cartão BOM para comprar créditos de forma fácil e rápida.
          </BrandText>
          <Button
            onPress={onComplete}
            outline="white"
            outlineText="white"
          >
            Ok, vamos começar
          </Button>
        </ScrollView>
      </FadeInView>
    );
  }
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BRAND_SUCCESS,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIcon: {
    color: 'white',
    width: 72,
    fontSize: 72,
    marginBottom: 16,
  },
  successTitle: {
    color: 'white',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  thanksFeedback: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40
  }
});

export default RegisterSuccess;
