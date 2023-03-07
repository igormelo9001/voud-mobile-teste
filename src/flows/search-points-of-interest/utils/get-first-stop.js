export default function getFirstStop(item) {
  const { steps } = item.legs[0];
  return steps.find(step => step.travelMode !== 'WALKING');
}