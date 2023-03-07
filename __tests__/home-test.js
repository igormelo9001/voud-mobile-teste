import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";

import BrandText from "../src/components/BrandText";

import Home from "../src/flows/home/screens/UnloggedHome/UnloggedInfoModal";
describe("Test Render SCREEN HOME ", () => {
  it("should ## home/components/PointsOfInterestMap/ ## render correctly", () => {
    const wrapper = shallow(<Home />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
