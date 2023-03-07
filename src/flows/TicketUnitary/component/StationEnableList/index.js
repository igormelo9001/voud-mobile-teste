import React from "react";

import { FlatList } from "react-native";

import StationEnable from "../StationEnable";

const renderItem = ({ item }) => <StationEnable item={item} />;

const StationEnableList = props => {
  const { data } = props;
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.name.toString()}
    />
  );
};

export default StationEnableList;
