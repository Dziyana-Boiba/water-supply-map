import L from 'leaflet';

import './pump-icon.scss';
import { pumpStBooster, pumpStElevation, flowType } from '../../constants/types';

const colors = {
  void: 'rgb(77,77, 77)',
  pipeWater: 'rgb(8, 94, 141)',
  border: 'rgb(178, 178, 178)',
  sensorBroken: 'rgb(232, 170, 66)',
  pumpWorking: 'rgb(93, 156, 89)',
  pumpStop: 'rgb(179, 48, 48)'
};

export const pumpStIcon = (
  pumps,
  pumpStSensor,
  sensorsValues,
  stationType,
  pumpStWidth,
  isPopupOpen
) => {
  const isSomePumpOn =
    pumps?.filter(p => p.sensors?.filter(s => sensorsValues?.[s.id].y > 0).length > 0).length > 0;

  const isPumpStOn =
    (pumpStSensor?.length > 0 &&
      pumpStSensor?.filter(s => sensorsValues?.[s.id].y > 0).length > 0) ||
    isSomePumpOn;

  const isAllPumpSensorsWorking =
    pumps?.filter(p => p.sensors?.filter(s => sensorsValues?.[s.id].y !== null).length > 0).length >
    0;

  const isSomeSensorBroken =
    pumpStSensor.length > 0
      ? pumpStSensor?.filter(s => sensorsValues?.[s.id].y === null).length > 0
      : !isAllPumpSensorsWorking;

  const pumpStFlowSensor = pumpStSensor?.find(s => s.measurement?.type.toLowerCase() === flowType);
  const pumpStFlowUnit = pumpStFlowSensor ? pumpStFlowSensor.measurement?.unit_short_pretty : '';
  const pumpStFlowValue = pumpStFlowSensor ? sensorsValues?.[pumpStFlowSensor.id].y : 0;

  // 22 is pipe width(10px) + node width(12px)
  const nodePipeX = stationType === pumpStElevation ? 16 : 0;
  const nodePipeY = stationType === pumpStElevation ? 0 : 16;

  const iconSizeX = pumpStWidth + nodePipeX;

  //40 is height of pumps container with flow value, 25 is without flow value
  const iconSizeY = pumpStFlowSensor ? 33 + nodePipeY : 23 + nodePipeY;

  const isPumpWorking = sensors => {
    return sensors.filter(s => sensorsValues?.[s.id].y > 0).length > 0;
  };

  const setPumpColor = sensors => {
    let color = colors.border;
    if (sensors && sensors.length > 0) {
      color =
        sensors.filter(s => sensorsValues?.[s.id].y === null).length > 0
          ? colors.sensorBroken
          : sensors.filter(s => sensorsValues?.[s.id].y > 0).length > 0
          ? colors.pumpWorking
          : colors.pumpStop;
    } else {
      color = isSomeSensorBroken
        ? colors.sensorBroken
        : isPumpStOn
        ? colors.pumpWorking
        : colors.pumpStop;
    }
    return color;
  };

  const allPumps = `${
    pumps?.length > 0
      ? pumps.map(
          (p, i) =>
            `<div class='pump' style='background-color: ${setPumpColor(p.sensors)}'>${
              isPopupOpen
                ? i + 1
                : `<div class='${
                    isPumpWorking(p.sensors) ? 'pump-motor anim' : 'pump-motor'
                  }'></div>`
            }</div>`
        )
      : ''
  }`
    .split(',')
    .join('');

  const pumpHTML = `<div class='pump-node' style='background-color: ${
    isPumpStOn ? colors.pipeWater : colors.void
  }'></div>
  <div class='pump-pipe'></div>
  <div class='pump-station' style='border: 1.5px solid ${
    isSomeSensorBroken ? colors.sensorBroken : isPumpStOn ? colors.pumpWorking : colors.pumpStop
  }'>
    <div class='pumps-container'>${allPumps}</div>
    ${
      pumpStFlowSensor && sensorsValues?.[pumpStFlowSensor.id].y === null
        ? `<div class='pump-station-flow'><span class='unit'>N/A</span></div>`
        : pumpStFlowSensor && sensorsValues?.[pumpStFlowSensor.id].y !== null
        ? `<div class='pump-station-flow'>${pumpStFlowValue}<span class='unit'>${pumpStFlowUnit}</span></div>`
        : ''
    } 
  </div>
  `;

  const iconAnchorX = stationType === pumpStElevation ? 5 : iconSizeX / 2;
  const iconAnchorY =
    stationType === pumpStElevation
      ? iconSizeY / 2
      : stationType === pumpStBooster
      ? iconSizeY - 5
      : 5;

  const className = `pump-icon-container ${stationType}`;

  const pumpIcon = new L.divIcon({
    className: className,
    html: pumpHTML,
    iconSize: [iconSizeX, iconSizeY], // size of the icon
    iconAnchor: [iconAnchorX, iconAnchorY] // point of the icon which will correspond to marker's location
  });

  return pumpIcon;
};
