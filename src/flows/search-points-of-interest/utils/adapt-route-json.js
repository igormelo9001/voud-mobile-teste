export default function adaptRouteJson(item) {
    /*  It groups steps by type while maintaining the order
        and sums the total substeps of the route.*/
    const { steps } = item.legs[0];
    const stepsWithoutWalking = steps.filter((step) => {
      return step.travelMode !== "WALKING";
    });
    const formattedSteps = stepsWithoutWalking.reduce((acc, step, index) => {
      const { line } = step.transitDetails;
      const { type } = line.vehicle;
      const { shortName, name } = line;
      let stepObj = {};
      if(shortName) {
          stepObj.shortName = shortName.match(/\d+/)[0];
      } else {
        stepObj.shortName = name;
      }
      const { color } = line;
      if(color) {
        if(color === 'FFFF00') stepObj.color = '#F0C800';
        else stepObj.color = `#${color}`;
      }
      if (index === 0) {
        acc.steps.push({ type, substeps: [stepObj] });
        acc.totalSubsteps++;
        return acc;
      } else {
        const { length } = acc.steps;
        if (acc.steps[length - 1].type === type) {
          acc.steps[length - 1].substeps.push(stepObj);
        } else {
          acc.steps.push({ type, substeps: [stepObj] });
        }
        acc.totalSubsteps++;
        return acc;
      }
    }, { steps: [], totalSubsteps: 0 });
    return formattedSteps;
  }


  export function adaptColor(color){
    let newColor = ''; 
    if(color) {
      if(color === 'FFFF00') newColor = '#F0C800';
      else newColor =  color.indexOf('#') >= 0 ? color : `#${color}`;
    }
    return newColor;
  }