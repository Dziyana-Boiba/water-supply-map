import L from 'leaflet';
import { flowType } from '../../constants/types';

const colors = {
  background: 'rgb(230, 229, 229)',
  border: 'rgb(129, 129, 129)',
  tap: 'rgb(100, 100, 100)',
  drop: 'rgb(46, 124, 165)',
  text: 'rgb(0, 0, 0)',
  errorText: 'rgba(219, 146, 22, 1)',
  pipeWater: 'rgb(8, 94, 141)',
  void: 'rgb(77, 77, 77)',
  stroke: 'rgb(178, 178, 178)'
};

export const consumptionSVG = (sensors, sensorsValues) => {
  const flow = sensors.find(s => s.measurement.type.toLowerCase() === flowType);
  const value = flow ? sensorsValues?.[flow.id].y : '';

  const tankString = `data:image/svg+xml;utf-8, 
    <svg viewBox="0 0 150 200" x="0px" y="0px" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle fill='${colors.background}' cx="75" cy="75" r="72"/>
        <path fill='${
          colors.border
        }' d="M75,6c38,0,69,31,69,69s-31,69-69,69S6,113,6,75S37,6,75,6 M75,0C33.6,0,0,33.6,0,75s33.6,75,75,75
          s75-33.6,75-75S116.4,0,75,0L75,0z"/>
      </g>
      <g >
        <path fill='${
          colors.tap
        }' d="M73.4,16.9c-0.6,0.3-1.4,0.7-1.7,1c-0.5,0.5-1.1,0.6-6.2,0.6c-4.9,0-5.7-0.1-6.8-0.6c-0.7-0.3-1.7-0.6-2.3-0.6
	h-1.1v3v3h1.2c0.7,0,1.8-0.3,2.6-0.6c1.2-0.5,2.2-0.6,6.5-0.6h5l1.3,1.1c1.2,1,1.2,1.2,1.2,3.4v2.3l-2,0.7c-1.4,0.5-2.6,1.2-3.8,2.3
	c-1,0.9-1.8,1.7-1.8,1.9s-3.7,0.3-8.1,0.4c-7.5,0.1-8.3,0.1-9.6,0.7c-3.2,1.4-4.2,3.2-4.2,7.5v2.8l-2.6,1.9c-2.3,1.8-2.6,2-2.6,3.1
	v1.2h11h11v-1.3c0-1.3-0.1-1.3-2.7-3c-2.3-1.5-2.7-1.9-2.7-2.6c0-2.2,1.6-2.9,6.5-2.9c3.5,0,3.6,0,4,0.7c0.7,1.3,3.4,3.5,5.3,4.3
	C76,48.8,83,47,85.6,43l0.9-1.4h3.1h3l3.6,2.6c3.5,2.5,3.6,2.5,5.3,2.5l1.8-0.1l0.1-8.9l0.1-8.9h-2.1l-2.1,0l-3.5,2.7l-3.5,2.7h-3.1
	c-3.1,0-3.1,0-3.7-0.8c-1.1-1.5-3.8-3.3-5.7-3.9l-1.9-0.5v-2.2c0-2.2,0.1-2.3,1.3-3.4l1.3-1.2l5.5,0.1c4.6,0.1,5.7,0.2,6.5,0.6
	c0.5,0.3,1.4,0.5,2.1,0.5h1.2v-3v-3h-1c-0.6,0-1.6,0.3-2.2,0.6c-1.1,0.5-1.8,0.6-6.8,0.6c-5.3,0-5.6,0-6.3-0.6
	C78,16.5,75.3,16.1,73.4,16.9z"/>
        <path fill='${
          colors.drop
        }' d="M47.1,55.6c-1,1.3-2.3,3.3-3,4.5c-1.1,1.9-1.3,2.5-1.3,4.1c0,2.1,0.6,3,2.6,3.9c1.7,0.8,6,0.8,7.3,0
	c2.6-1.5,3.2-3.6,2-6.4c-0.8-1.8-3.9-6.3-5.2-7.7l-0.6-0.6L47.1,55.6z M45.5,60.9"/>
      </g>
      <rect x="69" y="150" fill='${colors.stroke}' width='12' height="20"/>
      <circle fill='${value > 0 ? colors.pipeWater : colors.void}' stroke-width='5px' stroke='${
    colors.stroke
  }' cx="75" cy="184" r="15"/>
      ${
        value === null
          ? `<text x="75" y="105" text-anchor="middle" font-family='"Open Sans", sans-serif' letter-spacing='2px' font-size="30" font-weight="700" fill="black">N/A</text>`
          : value === ''
          ? `<text x="75" y="105" text-anchor="middle" font-family='"Open Sans", sans-serif' font-size="28" font-weight="700" fill="black">No data</text>`
          : `<text x="75" y="108" text-anchor="middle" font-family='"Open Sans", sans-serif' font-size="36" font-weight="600" fill="${
              colors.text
            }">${value}<tspan font-weight="500" font-size="22" fill="${colors.text}"> ${
              flow ? flow.measurement.unit_short_pretty : ''
            }</tspan></text>`
      }      
  </svg>`;

  const xSize = 150 / 3.5; //150 is width of svg
  const ySize = 200 / 3.5; //200 is height of svg
  const xAnchor = xSize / 2;
  const yAnchor = ySize - 3;
  const iconAnchor = [xAnchor, yAnchor];

  const tankIcon = new L.Icon({
    iconUrl: tankString,
    iconSize: [xSize, ySize],
    iconAnchor: iconAnchor // point of the icon which will correspond to marker's location
  });

  return tankIcon;
};
