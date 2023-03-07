// NPM imports
import React from 'react';
import Moment from 'moment';

import { Image, ScrollView, SectionList, View, Text } from 'react-native';

// VouD imports
import { colors } from '../../../styles';
import BrandText from '../../../components/BrandText';
import TouchableText from '../../../components/TouchableText';

// Group imports
import NextRechargeItem from './item';
import NextRechargeSectionHeader from './SectionHeader';

const NextRechargesList = ({ itemList }) => {
  const _itemListToSections = () =>
    itemList.reduce((sections, item, i) => {
      const monthYearGroup = Moment(item.availableDate).format('MMMM YYYY');
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
          date: item.availableDate,
          isFirst: sections.length === 0,
          data: [itemObj],
        },
      ];
    }, []);

  const _renderSectionHeader = ({ section }) => {
    const sectionDate = Moment(section.date);
    const today = Moment();
    const isCurrentMonth = sectionDate.isSame(today, 'month') && sectionDate.isSame(today, 'year');

    // if (section.isFirst && isCurrentMonth) return;

    return <NextRechargeSectionHeader isFirst={section.isFirst} title={section.title} />;
  };

  const _renderCardStatementRow = () => ({ item }) => {
    return <NextRechargeItem itemData={item} />;
  };

  return (
    <View style={{ flex: 1, marginBottom: 70 }}>
      <SectionList
        renderItem={_renderCardStatementRow()}
        renderSectionHeader={_renderSectionHeader}
        sections={_itemListToSections()}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};

export default NextRechargesList;
