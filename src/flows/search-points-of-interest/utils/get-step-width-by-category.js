import configRouteItemObj from './config-route-item-obj';

export default function getStepWidthByCategory(step) {
    const { 
      SINGLE_SUBSTEP_ITEM_WIDTH,
      TWO_SUBSTEPS_ITEM_WIDTH,
      INFINITE_SUBSTEPS_ITEM_WIDTH,
    } = configRouteItemObj;
    const { length } = step.substeps;
    if(length === 1) return SINGLE_SUBSTEP_ITEM_WIDTH;
    if(length === 2) return TWO_SUBSTEPS_ITEM_WIDTH;
    return INFINITE_SUBSTEPS_ITEM_WIDTH;
  }