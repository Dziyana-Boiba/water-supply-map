import L from 'leaflet';
import { flowType } from '../../constants/types';

export const monitoringPointSVG = (sensors, sensorsValues) => {
  const flow = sensors.find(s => s.measurement.type.toLowerCase() === flowType);
  const value = flow ? sensorsValues?.[flow.id].y : '';

  const flowSplit = String(value).split('').reverse();
  const flowLength = flowSplit.length;

  const monitoringString = `data:image/svg+xml;utf-8,
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 110" >
  <style type="text/css">
    .st0{fill:rgb(224, 221, 221);}
    .st1{fill:rgb(99, 95, 95);}
  </style>
  <g>
  <circle class="st0" cx="50" cy="40" r="38"/>
    <path class="st1" d="M50,4c19.9,0,36,16.1,36,36S69.9,76,50,76S14,59.9,14,40S30.1,4,50,4 M50,0C27.9,0,10,17.9,10,40
      s17.9,40,40,40s40-17.9,40-40S72.1,0,50,0L50,0z"/>

  </g>
   <g>
    <rect x="19" y="28.5" width="15" height="23" fill='${
      flowSplit.length > 3 ? 'rgb(159, 56, 56)' : 'rgb(178, 178, 178)'
    }' />
    <text x="26.5" y="45" text-anchor="middle" font-family="Roboto Mono" font-size="16" font-weight="700" fill="rgb(250, 251, 251)">${
      flowSplit.length > 3 ? flowSplit[3] : ''
    }</text>
  </g>
  <g>
    <rect x="35" y="28.5" width="15" height="23" fill='${
      flowSplit.length > 2 ? 'rgb(159, 56, 56)' : 'rgb(178, 178, 178)'
    }' />
    <text x="42.5" y="45" text-anchor="middle" font-family="Ubuntu" font-size="18" font-weight="700" fill="rgb(250, 251, 251)">${
      flowSplit.length > 2 ? flowSplit[2] : ''
    }</text>
  </g>
    <g>
    <rect x="51" y="28.5" width="15" height="23" fill='${
      flowSplit.length > 1 ? 'rgb(159, 56, 56)' : 'rgb(178, 178, 178)'
    }' />
    <text x="58.5" y="45" text-anchor="middle" font-family="Ubuntu" font-size="18" font-weight="700" fill="rgb(250, 251, 251)">${
      flowSplit.length > 1 ? flowSplit[1] : ''
    }</text>
  </g>
  <g>
    <rect x="19" y="28.5" width="63" height="23" fill='${'rgb(0, 0, 0)'}' />
    <text x="74.5" y="45" text-anchor="end" font-family="Ubuntu" font-size="18" font-weight="700" fill="rgb(159, 56, 56)">${value}</text>
  </g>
  <rect x="47" y="80" fill='rgb(178, 178, 178)'  width='6' height="15"/>
  <circle fill='${
    value > 0 ? 'rgb(8, 94, 141)' : 'rgb(77, 77, 77)'
  }' stroke-width='2px' stroke='rgb(178, 178, 178)' cx="50" cy="102" r="8"/>
  <text x="50" y="70" text-anchor="middle" font-family="Ubuntu" font-size="16" font-weight="700" fill="rgb(99, 95, 95)">${
    flow.measurement.unit_short_pretty
  }</text>
</svg>`;

  {
    /* <rect
  fill='rgb(224, 221, 221)'
  stroke='rgb(99, 95, 95)'
  stroke-width='2'
  x='10'
  y='20'
  width='80'
  height='60'
  rx='10'
/>; */
  }

  const monitoringIcon = new L.Icon({
    iconUrl: monitoringString,
    iconSize: [66, 73], // size of the icon
    iconAnchor: [33, 73] // point of the icon which will correspond to marker's location
  });

  return monitoringIcon;
};
