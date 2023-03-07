// NPM imports
import React from "react";
import Moment from "moment";

import { SectionList, View } from "react-native";

// VouD imports
import { colors } from "../../../../../styles";
import BrandText from "../../../../../components/BrandText";
import TouchableText from "../../../../../components/TouchableText";

import SectionHeader from "../../component/SectionHeader";
import Item from "../../component/Item";

const ExtractList = ({ itemList }) => {
  const itemListToSections = () =>
    itemList.reduce((sections, item, i) => {
      const monthYearGroup = Moment(item.lastSync).format("MMMM YYYY");
      const itemSection = sections.find(
        section => section.key === monthYearGroup
      );

      const itemObj = {
        ...item,
        key: i,
        isFirst: i === 0,
        isLast: i + 1 === itemList.length
      };

      if (itemSection) {
        return sections.map(section => {
          if (section.key === itemSection.key) {
            return {
              ...section,
              data: [...section.data, itemObj]
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
          date: item.lastSync,
          isFirst: sections.length === 0,
          data: [itemObj]
        }
      ];
    }, []);

  const renderSectionHeader = ({ section }) => {
    return <SectionHeader isFirst={section.isFirst} title={section.title} />;
  };

  const renderStatementRow = () => ({ item }) => {
    return <Item itemData={item} />;
  };

  return (
    <View style={{ flex: 1, marginBottom: 5 }}>
      <SectionList
        renderItem={renderStatementRow()}
        renderSectionHeader={renderSectionHeader}
        sections={itemListToSections()}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};

export default ExtractList;
