// NPM imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native';
import Moment from 'moment';

// VouD imports
import Header, { headerActionTypes } from '../../components/Header';
import BrandText from '../../components/BrandText';
import SystemText from '../../components/SystemText';
import InfoListItem from '../../components/InfoList/InfoListItem';
import KeyValueItem from '../../components/KeyValueItem';
import { colors } from '../../styles';
import { formatCurrency, formatBomCardNumber } from '../../utils/parsers-formaters';

import { getCurrentTransportCard, getSchoolCardDetailsHelpId } from '../../redux/selectors';
import { transportCardTypes, walletApplicationId } from '../../redux/transport-card';
import { viewHelpDetails } from '../../redux/help';
import { routeNames } from '../../shared/route-names';
import { navigateToRoute } from '../../redux/nav';

// Screen component
class SchoolCardDetailsView extends Component {
    constructor(props) {
        super(props);
    }

    _calculateGratuityActualQuota = (application) => {
        let actualQuota = application.gratuityLimit - application.gratuityUsed;
        return actualQuota > 0 ? actualQuota : 0;
    }

    _getQuotaAvailableDate = () => {
        return Moment().endOf('month').format('DD/MM/YYYY');
    }

    _isCardEscolar = () => {
        const { cardData } = this.props;
        return cardData.layoutType === transportCardTypes.BOM_ESCOLAR;
    }

    _viewHelp = () => {
        const { dispatch, schoolCardDetailsHelpId } = this.props;
        dispatch(viewHelpDetails(schoolCardDetailsHelpId));
        dispatch(navigateToRoute(routeNames.HELP_DETAILS));
    }

    render() {
        const { dispatch, cardData } = this.props;
        const applicationId = this._isCardEscolar() ? walletApplicationId.BOM_ESCOLAR : walletApplicationId.BOM_ESCOLAR_GRATUIDADE;
        const application = cardData.wallets.find(wallet => wallet.applicationId === applicationId);

        return (
            <View style={styles.mainContainer}>
                <Header
                    title="Escolar"
                    left={{
                        type: headerActionTypes.CLOSE,
                        onPress: () => dispatch(NavigationActions.back())
                    }}
                    right={{
                        type: headerActionTypes.HELP,
                        onPress: this._viewHelp
                    }}
                />
                <ScrollView style={styles.scrollView}>
                    <View style={styles.cardInfoContainer}>
                        <BrandText style={styles.cardInfoLabel}>{cardData.nick}</BrandText>
                        <SystemText style={styles.cardInfoValue}>{formatBomCardNumber(cardData.cardNumber)}</SystemText>
                    </View>
                    <View style={styles.schoolCardInfoContainer}>
                        {this._isCardEscolar() && 
                            <KeyValueItem
                                keyContent={'Valor mensal'}
                                valueContent={'R$ '+ formatCurrency(application.quoteValue)}
                            />
                        }
                        <KeyValueItem
                            keyContent={'Cota mensal'}
                            valueContent={this._isCardEscolar() ?
                                application.purchasesQuantity : application.gratuityLimit}
                        />
                    </View>
                    <InfoListItem 
                        itemContent={'Cota atual (até ' + this._getQuotaAvailableDate() + ')'}
                        isHeader
                    />
                    <View style={styles.groupInfoContainer}>
                        {this._isCardEscolar() && 
                            <KeyValueItem
                                keyContent={'Disponível para compra'}
                                valueContent={'R$ ' + formatCurrency(application.quoteValueAvailable)}
                            />
                        }
                        <KeyValueItem
                            keyContent={'Cota disponível'}
                            valueContent={this._isCardEscolar() ?
                                application.purchasesQuantityAvailable : this._calculateGratuityActualQuota(application)}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    scrollView: {
        flex: 1
    },
    cardInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 8
    },
    cardInfoLabel: {
        flex: 1,
        marginRight: 8,
        fontSize: 16,
        lineHeight: 20,
        color: colors.GRAY_DARKER
    },
    cardInfoValue: {
        padding: 8,
        borderWidth: 1,
        borderColor: colors.CARD_E,
        borderRadius: 2,
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '500',
        color: colors.GRAY_DARKER
    },
    schoolCardInfoContainer: {
        marginBottom: 16
    },
    groupInfoContainer: {
        paddingTop: 8,
        paddingBottom: 16
    },

    detailSubheader: {
        padding: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.GRAY_LIGHT2
    },
    cardTypeLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 20,
        color: colors.GRAY_DARKER
    },
    detailSubheaderLabels: {
        flexDirection: 'row',
        marginTop: 8
    },
    subheaderInfoLabelL: {
        flex: 1,
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 16,
        color: colors.GRAY
    },
    subheaderInfoLabelR: {
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 16,
        color: colors.GRAY
    }
});

// redux connect and export
const mapStateToProps = state => {
    return {
        cardData: getCurrentTransportCard(state),
        schoolCardDetailsHelpId: getSchoolCardDetailsHelpId(state)
    };
};

export const SchoolCardDetails = connect(mapStateToProps)(SchoolCardDetailsView);
