import L from 'leaflet';
import { flowType, waterLevel } from '../../constants/types';
import tap from '../../assets/images/tap-small.svg';

import './cluster-icon.scss';

const colors = {
  void: 'rgb(77,77, 77)',
  pipeWater: 'rgb(8, 94, 141)',
  border: 'rgb(178, 178, 178)',
  sensorBroken: 'rgb(232, 170, 66)',
  pumpWorking: 'rgb(93, 156, 89)',
  pumpStop: 'rgb(179, 48, 48)',
  on: 'rgb(124, 196, 120)',
  off: ' rgb(251, 138, 138)'
};

export function createClusterCustomIcon(subsystem, sensorsValues) {
  const pumpStStatus = (sensors, pumps) => {
    const isSomePumpOn =
      pumps?.filter(p => p.sensors?.filter(s => sensorsValues[s.id]?.y > 0).length > 0).length > 0;

    const isPumpStOn =
      (sensors?.length > 0 && sensors?.filter(s => sensorsValues[s.id]?.y > 0).length > 0) ||
      isSomePumpOn;

    const isAllPumpSensorsWorking =
      pumps?.filter(p => p.sensors?.filter(s => sensorsValues?.[s.id].y !== null).length > 0)
        .length > 0;

    const isSomeSensorBroken =
      sensors.length > 0
        ? sensors?.filter(s => sensorsValues?.[s.id].y === null).length > 0
        : !isAllPumpSensorsWorking;
    return isSomeSensorBroken ? null : isPumpStOn;
  };

  const setPumpColor = (sensors, devices, stSensors) => {
    let color = colors.border;
    if (sensors && sensors.length > 0) {
      color =
        sensors.filter(s => sensorsValues?.[s.id].y === null).length > 0
          ? colors.sensorBroken
          : sensors.filter(s => sensorsValues?.[s.id].y > 0).length > 0
          ? colors.pumpWorking
          : colors.pumpStop;
    } else {
      color =
        pumpStStatus(stSensors, devices) === null
          ? colors.sensorBroken
          : pumpStStatus(stSensors, devices)
          ? colors.pumpWorking
          : colors.pumpStop;
    }
    return color;
  };

  const findFlow = sensors => {
    return sensors?.find(s => s.measurement?.type.toLowerCase() === flowType);
  };

  const findLevelSensors = sensors => {
    return sensors?.find(s => s.measurement?.type.toLowerCase() === waterLevel);
  };
  const findWaterLevelValue = sensors => {
    const levelSensor = findLevelSensors(sensors);
    return levelSensor ? sensorsValues?.[levelSensor.id].y : 0;
  };

  const tank = `${subsystem.tanks.map(
    t =>
      `<div class='tank'>
            <div class='tank-cells-container'>
            ${t.devices.map(
              (d, i) =>
                `<div class='tank-cell-wrapper'>
                  <div class='tank-cell'>
                    <div class='tank-cell-water-level' style='height: ${
                      d.sensors?.length > 0 && findWaterLevelValue(d.sensors)
                        ? (findWaterLevelValue(d.sensors) / (t.maximum_level - t.minimum_level)) *
                          100
                        : 0
                    }%'></div>
                  </div>
                  <div class='water-number'>${
                    d.sensors?.length === 0
                      ? ''
                      : findWaterLevelValue(d.sensors) === null
                      ? 'N/A'
                      : findWaterLevelValue(d.sensors)
                  } <span class='unit'>${
                  d.sensors?.length === 0
                    ? 'No data'
                    : findLevelSensors(d.sensors) && findWaterLevelValue(d.sensors) !== null
                    ? findLevelSensors(d.sensors).measurement.unit_short_pretty
                    : ''
                }</span></div>
              </div>`
            )} 
            </div>
          </div>`
  )}`
    .split(',')
    .join('');

  const pump = `${subsystem.pumpSt.map(
    p => `<div class='pump-station-container' style='border: 1px solid ${
      pumpStStatus(p.sensors, p.devices) === null
        ? colors.sensorBroken
        : pumpStStatus(p.sensors, p.devices)
        ? colors.pumpWorking
        : colors.pumpStop
    }'>
      <div class='pumps-container'>${p.devices.map(
        (d, i) =>
          `<div class='pump' style='background-color: ${setPumpColor(
            d.sensors,
            p.devices,
            p.sensors
          )}'></div>`
      )}</div>
      ${
        findFlow(p.sensors) && sensorsValues[findFlow(p.sensors).id].y === null
          ? `<span class='flow'>N/A</span>`
          : findFlow(p.sensors) && sensorsValues[findFlow(p.sensors).id].y !== null
          ? `<span class='flow'>${sensorsValues[findFlow(p.sensors).id].y}<span class='unit'>${
              findFlow(p.sensors).measurement.unit_short_pretty
            }</span></span>`
          : ''
      } 
      </div>`
  )}`
    .split(',')
    .join('');

  const consumption = `${subsystem.consP.map(
    cons => `<div class='consumption'>
          <span class='type'><img src='${tap}'></img></span>
          ${
            findFlow(cons.sensors) && sensorsValues[findFlow(cons.sensors).id].y === null
              ? `<span class='flow'>N/A</span>`
              : findFlow(cons.sensors) && sensorsValues[findFlow(cons.sensors).id].y !== null
              ? `<span class='flow'>${
                  sensorsValues[findFlow(cons.sensors).id].y
                }<span class='unit'>${
                  findFlow(cons.sensors).measurement?.unit_short_pretty
                }</span></span>`
              : `<span class='flow'>No data</span>`
          }     
          </div>`
  )}`
    .split(',')
    .join('');

  const monitoring = `${subsystem.monP.map(
    mon => `<div class='monitoring'>
          <div class='display'>${
            mon.sensors?.length > 0
              ? `<div class='measurement-data' style='color: ${
                  sensorsValues?.[mon.sensors[0].id].y === null
                    ? colors.sensorBroken
                    : sensorsValues?.[mon.sensors[0].id].y
                    ? colors.on
                    : colors.off
                }'>${
                  sensorsValues?.[mon.sensors[0].id].y === null
                    ? 'N/A'
                    : sensorsValues?.[mon.sensors[0].id].y
                }</div>`
              : 'No data'
          }</div>
           <span class='unit'>${
             mon.sensors?.length > 0 ? mon.sensors[0].measurement.unit_short_pretty : ''
           }</span>          
          </div>`
  )}`
    .split(',')
    .join('');

  const clusterHTML = `<div class='cluster-container'>
      <div class='subsystem-name'>${subsystem.name}</div>
      <div class='subsystem-devices'>
        <div class='tank-block'>${subsystem.tanks.length > 0 ? tank : ''}</div>
        <div>
          <div class='pump-st-block'>${subsystem.pumpSt.length > 0 ? pump : ''}</div>
          <div class='cons-block'>${subsystem.consP.length > 0 ? consumption : ''}</div> 
          <div class='mon-block'>${subsystem.monP.length > 0 ? monitoring : ''}</div> 
        </div>
      </div>    
    </div>`;

  return L.divIcon({
    html: clusterHTML,
    iconAnchor: [50, 50],
    className: 'marker-cluster-custom'
  });
}
