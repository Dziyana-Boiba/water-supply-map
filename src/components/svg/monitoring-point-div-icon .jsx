import L from 'leaflet';
import './monitoring-poin-icon.scss';

const colors = {
  void: 'rgb(77,77, 77)',
  pipeWater: 'rgb(8, 94, 141)',
  border: 'rgb(178, 178, 178)',
  broken: 'rgb(232, 170, 66)',
  on: 'rgb(124, 196, 120)',
  off: ' rgb(251, 138, 138)',
  buttonOn: 'rgb(100, 173, 96)',
  buttonOff: 'rgb(179, 48, 48)'
};

export const monitoringPointDIV = (sensors, sensorsValues) => {
  const sensor = sensors?.[0];
  const value = sensor ? sensorsValues?.[sensor.id].y : '';

  const monHTML = `<div class='mon-container'>
    <div class='mon-display'>
    ${
      sensor
        ? `<div class='measurement-data' style='color: ${
            value === null ? colors.broken : value ? colors.on : colors.off
          }'>${value === null ? 'N/A' : value}</div>`
        : 'No data'
    }
    </div>
    <div class='unit'><span class='dot' style='background-color: ${
      value === null ? colors.broken : value ? colors.buttonOn : colors.buttonOff
    }'></span>${sensor ? sensor.measurement?.unit_short_pretty : ''}</div>   
  </div>
  <div class='pump-pipe'></div>
  <div class='pump-node' style='background-color: ${value ? colors.pipeWater : colors.void}'></div>
  `;

  const xSize = 45;
  const ySize = 61;
  const xAnchor = xSize / 2;
  const yAnchor = ySize - 5;

  const monitoringIcon = new L.divIcon({
    className: 'monitoring-icon',
    html: monHTML,
    iconSize: [xSize, ySize], // size of the icon
    iconAnchor: [xAnchor, yAnchor] // point of the icon which will correspond to marker's location
  });

  return monitoringIcon;
};
