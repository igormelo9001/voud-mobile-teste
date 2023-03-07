// NPM imports
import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

import { Image, ScrollView, SectionList, View } from 'react-native';

// VouD imports
import { colors } from '../../../styles';
import BrandText from '../../../components/BrandText';
import TouchableText from '../../../components/TouchableText';
import Loader from '../../../components/Loader';
import { walletApplicationId } from '../../../redux/transport-card';

// Group imports
import CardStatementItem from './Item';
import CardStatementSectionHeader from './SectionHeader';

const errorImage = require('../../../images/error.png');
const emptyImage = require('../../../images/empty.png');

const CardStatement = ({
  cardData,
  itemList,
  onPress,
  style,
  statementUI,
  onReload,
  showEntryType,
  showMoviment,
  isLoadingExtract,
  hasNextRecharges,
}) => {
  const _itemListToSections = () =>
    itemList.reduce((sections, item, i) => {
      const monthYearGroup = Moment(item.transactionDate).format('MMMM YYYY');
      const itemSection = sections.find(section => section.key === monthYearGroup);
      const itemObj = {
        ...item,
        key: i,
        isFirst: i === 0,
        isLast: i + 1 === itemList.length,
      };

      if (itemSection) {
        return sections.map(section => {
          if (section.key === itemSection.key) {
            return {
              ...section,
              data: [...section.data, itemObj],
            };
          }

          return section;
        });
      }

      return [
        ...sections,
        {
          key: monthYearGroup,
          title: monthYearGroup,
          date: item.transactionDate,
          isFirst: sections.length === 0,
          data: [itemObj],
        },
      ];
    }, []);

  const _getGratuityLimit = () => {
    const wallets = cardData && cardData.wallets ? cardData.wallets : null;
    const application = wallets
      ? wallets.find(wallet => wallet.applicationId === walletApplicationId.BOM_ESCOLAR_GRATUIDADE)
      : null;

    if (!application) return null;

    return application.gratuityLimit || null;
  };

  const _renderCardStatementRow = gratuityLimit => ({ item }) => {
    return (
      <CardStatementItem
        itemData={item}
        onPress={onPress}
        showEntryType={showEntryType}
        gratuityLimit={gratuityLimit}
      />
    );
  };

  const _renderHeader = () => {
    if (!statementUI.isFetching && (!statementUI.error || statementUI.error === ''))
      RatingTracker.handlePositiveEvent();

    if (!showMoviment) {
      return null;
    }
    if (itemList.length > 0) {
      return (
        <View style={{ height: 52, backgroundColor: '#EAEAEA' }}>
          <BrandText style={styles.title}>Movimentações dos últimos 30 dias</BrandText>
        </View>
      );
    }
    return (
      <View>
        <View
          style={{
            flex: 1,
            paddingVertical: 8,
          }}
        >
          {(showMoviment && statementUI.isFetching && (
            <View style={styles.loaderContainer}>
              <Loader iconSize={60} text="Carregando..." style={styles.loader} />
            </View>
          )) ||
            (showMoviment && statementUI.error && statementUI.error !== '' && (
              <View style={styles.stateMessage}>
                <Image source={errorImage} style={styles.stateIcon} />
                <View style={styles.errorStateTextContainer}>
                  <BrandText style={styles.errorStateText}>
                    Ocorreu um erro na sua requisição
                  </BrandText>
                  <TouchableText
                    onPress={onReload}
                    style={styles.errorStateButton}
                    color={colors.BRAND_PRIMARY}
                  >
                    Tentar novamente
                  </TouchableText>
                </View>
              </View>
            )) ||
            (showMoviment && itemList.length === 0 && (
              <View>
                <BrandText style={styles.title}>Movimentações dos últimos 30 dias</BrandText>
                <View style={styles.stateMessage}>
                  <Image source={emptyImage} style={styles.stateIcon} />
                  <BrandText style={styles.emptyStateText}>Nenhum registro encontrado</BrandText>
                </View>
              </View>
            ))}
        </View>
      </View>
    );
  };

  const _renderSectionHeader = ({ section }) => {
    const sectionDate = Moment(section.date);
    const today = Moment();
    const isCurrentMonth = sectionDate.isSame(today, 'month') && sectionDate.isSame(today, 'year');

    // if (section.isFirst && isCurrentMonth) return;

    return <CardStatementSectionHeader isFirst={section.isFirst} title={section.title} />;
  };

  const title = !isLoadingExtract ? 'Ver extrato' : 'Ocultar extrato';
  const marginBottom = hasNextRecharges ? 100 : 10;

  return (
    <View style={[styles.mainContainer]}>
      {cardData && (
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <TouchableText onPress={onReload} textStyle={styles.titleLoading}>
            {title}
          </TouchableText>
        </View>
      )}
      {isLoadingExtract && (
        <View style={{ marginBottom }}>
          {_renderHeader()}
          <SectionList
            renderSectionHeader={_renderSectionHeader}
            renderItem={_renderCardStatementRow(_getGratuityLimit())}
            sections={_itemListToSections()}
            stickySectionHeadersEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = {
  mainContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.BRAND_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
    // paddingVertical: 8,
    lineHeight: 16,
    marginLeft: 17,
    marginTop: 16,
    marginBottom: 16,
  },
  stateMessage: {
    flexDirection: 'row',
    paddingVertical: 24,
    marginLeft: 8,
  },
  stateIcon: {
    height: 40,
    width: 40,
  },
  errorStateTextContainer: {
    marginLeft: 16,
  },
  errorStateText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.GRAY,
  },
  errorStateButton: {
    minHeight: 24,
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  emptyStateText: {
    margin: 8,
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.GRAY,
  },
  loaderContainer: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
  loader: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  titleLoading: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Raleway',
    lineHeight: 16,
  },
};

// prop types
CardStatement.propTypes = {
  itemList: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default CardStatement;
