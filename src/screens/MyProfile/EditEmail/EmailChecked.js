// NPM imports
import React from 'react';

import {
    View,
    StyleSheet
} from 'react-native';

// VouD imports
import BrandText from '../../../components/BrandText';
import Icon from '../../../components/Icon';
import TouchableText from '../../../components/TouchableText';
import FadeInView from '../../../components/FadeInView';
import { colors } from '../../../styles';

// Screen component
const EmailChecked = ({ style, onEdit, email }) => {

    return (
        <FadeInView style={style}>
            <View style={styles.confirmedBox}>
                <Icon
                    style={styles.icon}
                    name="checkmark-circle-outline"
                />
                <BrandText style={styles.email}>
                    {email}
                </BrandText>
                <BrandText style={styles.confirmationText}>
                    E-mail confirmado
                </BrandText>
            </View>
            <TouchableText
                onPress={onEdit}
                style={styles.touchableText}
                color={colors.BRAND_PRIMARY_LIGHTER}
            >
                Atualizar endereço de e-mail
            </TouchableText>
        </FadeInView>
    );
}

const styles = StyleSheet.create({
    confirmedBox: {
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.BRAND_SUCCESS
    },
    icon: {
        fontSize: 48,
        color: colors.BRAND_SUCCESS
    },
    email: {
        marginVertical: 8,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.GRAY_DARKER,
    },
    confirmationText: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.GRAY
    },
    touchableText: {
        marginTop: 24
    }
});

export default EmailChecked;
