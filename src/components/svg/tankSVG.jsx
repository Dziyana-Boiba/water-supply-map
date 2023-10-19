import L from 'leaflet';
import { waterLevel } from '../../constants/types';

const colors = {
  border: 'rgb(178, 178, 178)',
  water: 'rgb(96, 150, 180)',
  void: 'rgb(77, 77, 77)',
  nodeWater: 'rgb(8, 94, 141)',
  text: 'rgb(237, 237, 237)'
};

export const tankSVG = (cells, max, min, sensorsValues) => {
  const findSensorObj = sensors => {
    const levelSensorId = sensors?.find(s => s.measurement.type.toLowerCase() === waterLevel).id;
    return sensorsValues?.[levelSensorId];
  };

  const convertLevelToHeight = (sensors, type) => {
    let value =
      sensors?.length > 0
        ? type === 'current'
          ? findSensorObj(sensors).y
          : findSensorObj(sensors).prevValue
        : 0;
    value = (value || 0) > max ? max : value;
    const level = ((max - min - value) * 110) / (max - min);
    return level;
  };

  const isTankWithWater =
    cells.filter(c => (c.sensors.length > 0 ? findSensorObj(c.sensors).y : 0) > 0).length > 0;

  const xSize = cells.length * 100;
  const ySize = 250;

  const svgString = `data:image/svg+xml;utf-8,
      <svg viewBox="0 0 ${xSize} ${ySize}" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg">
      ${cells?.map(
        (cell, i) =>
          `<g transform="translate(${i * 100},0)"> 
            <g fill="${colors.border}">
              <path  d="M37.6,11.5c-9.3,2.8-22.1,11.2-26.1,17.4c-1.2,1.8,2.1,1.9,39.4,2c22.3,0,40.6-0.5,40.6-1.1c0-1.5-9.2-9.3-15.4-13.1C64.9,9.9,49.9,7.9,37.6,11.5z"/> 
              <path fill="${colors.water}" stroke-width="4px" stroke="${
            colors.border
          }" d="M17.7,98.3v56.1l32.5,0.2c17.9,0.2,33,0.2,33.8,0l1.3-0.4V98.2V42.2H51.4H17.7V98.3z"/> 
              <path  d="M91.4,160.1l-0.2-4.3c0-0.6-0.3-1.1-0.6-1.1H51.4H12.2c-0.3,0-0.6,0.5-0.6,1.1l-0.2,4.3l-0.1,4c0,0.7,0.2,1.2,0.6,1.2h39.5H91c0.3,0,0.6-0.6,0.6-1.2L91.4,160.1z"/> 
              <path d="M65.2,185.5c9.3-2.8,22.1-11.2,26.1-17.4c1.2-1.8-2.1-1.9-39.4-2c-22.3,0-40.6,0.5-40.6,1.1c0,1.5,9.2,9.3,15.4,13.1C37.9,187.1,53,189.1,65.2,185.5z"/> 
              <path d="M11.5,37l0.2,4.3c0,0.6,0.3,1.1,0.6,1.1h39.2h39.2c0.3,0,0.6-0.5,0.6-1.1l0.2-4.3l0.1-4c0-0.7-0.2-1.2-0.6-1.2H51.4H11.9c-0.3,0-0.6,0.6-0.6,1.2L11.5,37z"/> 
            </g> 
            <rect class="void" fill="${colors.void}" width="63" height="${
            cell.sensors?.length > 0 ? convertLevelToHeight(cell.sensors, 'current') : 110
          }" x="20" y="42.45"> 
              <animate
                attributeName='height'
                from="${
                  cell.sensors?.length > 0 ? convertLevelToHeight(cell.sensors, 'previous') : 110
                }"
                to="${
                  cell.sensors?.length > 0 ? convertLevelToHeight(cell.sensors, 'current') : 110
                }"
                dur='0.5s'
                fill='freeze'
              />; 
            </rect> 
            ${
              cell.sensors?.length > 0
                ? `<text
                  x='52'
                  y='104'
                  text-anchor='middle'
                  font-family="'Open Sans', sans-serif"
                  font-size="${findSensorObj(cell.sensors).y === null ? '25' : '30'}"
                  font-weight='400'
                  letter-spacing='1px'
                  fill='${colors.text}'
                >
                  ${findSensorObj(cell.sensors).y === null ? 'N/A' : findSensorObj(cell.sensors).y}
                </text>`
                : `<text x="52" y="90" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="20" font-weight="400" letter-spacing='1px' fill="${colors.text}">No</text>
                  <text x="52" y="118" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="20" font-weight="400" letter-spacing='1px' fill="${colors.text}">data</text>`
            }
            
          </g>`
      )}
      ${
        cells.length > 1 &&
        cells.slice(1).map(
          (item, i) =>
            `<g transform="translate(${i * 100},0)">
              <rect transform='rotate(90 112 155)' fill="${
                colors.border
              }" width='7' height='22' x='112' y='155'/>
              </g>`
        )
      }
      ${
        cells.length > 1 && cells.length % 2 === 0
          ? `<g transform="translate(${(cells.length - 2) * 50},0)">
          <rect fill='${colors.border}'  width="10" height="54" x="97" y="162"/>
          <circle fill='${
            isTankWithWater ? colors.nodeWater : colors.void
          }' stroke-width='4px' stroke='${colors.border}' cx="102" cy="230" r="13"/>
          </g>`
          : `<g transform="translate(${(cells.length - 1) * 50},0)">
          <rect  fill='${colors.border}' width="10" height="30" x="48" y="187"/>
            <circle fill='${
              isTankWithWater ? colors.nodeWater : colors.void
            }' stroke-width='4px' stroke='${colors.border}' cx="53" cy="230" r="13"/>
            </g>`
      }
      </svg>`;

  const xMarkerSize = xSize / 3.2;
  const yMarkerSize = ySize / 3.2;
  const xAnchor = xMarkerSize / 2;
  const yAnchor = yMarkerSize - 6;

  const tankIcon = new L.Icon({
    iconUrl: svgString,
    iconSize: [xMarkerSize, yMarkerSize], // size of the icon
    iconAnchor: [xAnchor, yAnchor] // point of the icon which will correspond to marker's location
  });

  return tankIcon;
};
