import moment from 'moment';

export default function getTimeUntilNextPublicTransportArrival(departureTime) {
  const [ , , , departureHours, departureMinutes] = departureTime;
  const departureTimeInMinutes = (departureHours * 60) + departureMinutes;
  const [ hours, minutes ] = moment().format('HH:mm').split(':');
  const nowInMinutes = (Number(hours) * 60) + Number(minutes);
  return departureTimeInMinutes - nowInMinutes
}