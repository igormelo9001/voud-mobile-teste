import configRouteItemObj from './config-route-item-obj';

export default function getWidthForAbbreviatedSteps({ length }) {
  const {
    ABBREVIATED_SUBSTEP_ITEM_WIDTH,
  } = configRouteItemObj;
  return ABBREVIATED_SUBSTEP_ITEM_WIDTH * length;
}