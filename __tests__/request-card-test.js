import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

// import { RequestCard } from '../src/flows/RequestCard/screens/RequestCardPayment/index';
import RequestCard from "../src/flows/home/screens/UnloggedHome/UnloggedInfoModal";

describe("Testing Request Card Component", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<RequestCard />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
