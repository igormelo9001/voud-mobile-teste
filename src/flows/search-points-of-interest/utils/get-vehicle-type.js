export default function getVehicleType(step) {
  const { transitDetails: { line } } = step;
  const { vehicle: { type }} = line;
  let vehicleType = '';
  if(type === 'BUS') vehicleType = 'ônibus';
  if(type === 'HEAVY_RAIL') vehicleType = 'trêm';
  if(type === 'SUBWAY') vehicleType = 'metrô';
  return vehicleType;
}