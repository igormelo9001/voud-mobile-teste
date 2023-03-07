import React          from 'react';
import { View } from 'react-native';
import PropTypes      from 'prop-types';
import Moment         from 'moment';

// VouD imports
import { colors }      from '../../../styles';
import BrandText       from '../../../components/BrandText';
import SystemText      from '../../../components/SystemText';
import { formatCurrency } from '../../../utils/parsers-formaters';
import {
    walletApplicationIdToShortname,
    transactionTypeToDescription,
    transactionTypeToIcon,
    transactionTypes
} from '../../../redux/transport-card';


// Group imports
import CardStatementTimeline from './Timeline';

const CardStatementItem = ({ itemData, showEntryType, gratuityLimit }) => {

    const formatEntryDate = () =>
        Moment(itemData.transactionDate).format('DD MMM').toUpperCase();

    const formatEntryTime = () =>
        Moment(itemData.transactionDate).format('HH:mm');

    const renderEntryValue = () => {
        // gratuity
        if (itemData.characteristic === transactionTypes.GRATUIDADE)
            return (
                <SystemText style={styles.debitValue}>
                    {itemData.transactionValue} de {gratuityLimit}
                </SystemText>
            );

        const isCredit = itemData.characteristic === transactionTypes.RECARGA;
        return (
            <SystemText style={isCredit ? styles.creditValue : styles.debitValue}>
                {isCredit ? '+': '-'} R$ {formatCurrency(itemData.transactionValue)}
            </SystemText>
        );
    };

    let walletShortname = walletApplicationIdToShortname(itemData.applicationId);

    return (
        <View style={styles.mainContainer}>
            <CardStatementTimeline icon={transactionTypeToIcon(itemData.characteristic)} isFirst={itemData.isFirst} isLast={itemData.isLast}/>
            <View style={styles.entryContainer}>
                <View style={styles.entryDateContainer}>
                    <SystemText style={styles.entryDate}>{`${formatEntryDate()} (${formatEntryTime()})`}</SystemText>
                    {showEntryType && walletShortname &&
                        <View style={styles.entryCardTypeContainer}>
                            <BrandText style={styles.entryCardType}>
                                {walletShortname.toUpperCase()}
                            </BrandText>
                        </View>
                    }
                </View>
                <View style={styles.entryDescriptionContainer}>
                    <View style={styles.entryDescriptionWrapper}>
                        <SystemText style={styles.entryDescription} numberOfLines={1} ellipsizeMode={'tail'}>{transactionTypeToDescription(itemData.characteristic)}</SystemText>
                        <SystemText style={styles.entryAdditionalInfo}>{itemData.description}</SystemText>
                        {/* <SystemText style={styles.entryAdditionalInfo}>{formatEntryTime()}</SystemText> */}
                    </View>
                    {renderEntryValue()}
                </View>
            </View>
        </View>
    );
}

const styles = {
    mainContainer: {
        alignItems: 'stretch',
        flexDirection: 'row',
        paddingRight: 16
    },
    // Entry
    entryContainer: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'stretch',
        borderBottomColor: colors.GRAY_LIGHTER,
        borderBottomWidth: 1
    },
    entryDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    entryDate: {
        color: "#A3A3A3",
        fontSize: 12,
        marginRight: 16
    },
    entryCardTypeContainer: {
        justifyContent: 'center',
        backgroundColor: colors.GRAY_LIGHT2,
        paddingHorizontal: 4,
        height: 16,
        borderRadius: 8
    },
    entryCardType: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.GRAY
    },
    entryDescriptionContainer: {
        flexDirection: 'row'
    },
    entryDescription: {
        flex: 1,
        color: colors.GRAY_DARKER,
        fontSize: 18,
        lineHeight: 19,
        marginTop:4,
    },
    entryDescriptionWrapper: {
        flex: 1
    },
    creditValue: {
        color: colors.GRAY_DARKER,
        fontSize: 16,
        lineHeight: 19,
        marginLeft: 4,
        fontWeight:"bold",
    },
    debitValue: {
        color: colors.BRAND_ERROR,
        fontSize: 16,
        lineHeight: 19,
        marginLeft: 4,
        fontWeight:"bold",
    },
    entryAdditionalInfo: {
        color: colors.GRAY,
        fontSize: 15,
        lineHeight: 16,
        marginTop: 4
    }
}

// prop types
CardStatementItem.propTypes = {
    itemData: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default CardStatementItem;
