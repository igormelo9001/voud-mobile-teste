// NPM imports
import React from 'react';
import { pipe } from 'ramda';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';

// VouD imports
import BrandText from './BrandText';
import Loader from './Loader';
import TouchableText from './TouchableText';
import { colors } from '../styles';
import { appendIf } from '../utils/fp-util';

// Images
const emptyImg = require('../images/empty.png');
const errorImg = require('../images/error.png');
const errorImgWhite = require('../images/error-white.png');

// Component
const RequestFeedback = ({ loadingMessage, errorMessage, emptyMessage, retryMessage, isFetching, style, onRetry, isLight }) => {

    const getEmptyTextStyles = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.whiteText, isLight),
        StyleSheet.flatten
    );

    const getErrorTextStyles = pipe(
        baseStyle => [baseStyle],
        appendIf(styles.whiteText, isLight),
        StyleSheet.flatten
    );

    const renderContent = () => {
        if (isFetching)
            return <Loader text={loadingMessage || 'Carregando...'} />;

        if (errorMessage)
            return (
                <View>
                    <Image
                        source={isLight ? errorImgWhite : errorImg}
                        style={styles.image}
                    />
                    <BrandText style={getErrorTextStyles(styles.errorText)}>
                        {errorMessage}
                    </BrandText>
                    <TouchableText
                        onPress={onRetry}
                        style={styles.retryText}
                        color={isLight ? 'white' : colors.BRAND_PRIMARY}
                    >
                        {retryMessage}
                    </TouchableText>
                </View>
            );

        // if is empty
        return (
            <View>
                <Image
                    source={emptyImg}
                    style={styles.image}
                />
                <BrandText style={getEmptyTextStyles(styles.emptyText)}>
                    {emptyMessage}
                </BrandText>
            </View>
        );
    };

    return (
        <View style={StyleSheet.flatten([styles.container, style])}>
            {renderContent()}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    image: {
        alignSelf: 'center',
        marginVertical: 16
    },
    emptyText: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.GRAY
    },
    errorText: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.GRAY
    },
    retryText: {
        marginVertical: 16
    },
    whiteText: {
        color: 'white',
    },
});

export default RequestFeedback;
