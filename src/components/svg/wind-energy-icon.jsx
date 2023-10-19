import L from 'leaflet';

export const windSVG = value => {
  const windString = `data:image/svg+xml;utf-8,
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" >
<style type="text/css">
	.st0{fill-rule:evenodd;clip-rule:evenodd;fill:rgb(24, 20, 20);}
	.st1{fill-rule:evenodd;clip-rule:evenodd;fill:rgb(178, 178, 178);}
	.st2{fill-rule:evenodd;clip-rule:evenodd;fill:rgb(147, 138, 138);}
	.st4{fill:rgb(77, 77, 77);}
	.st3{fill:rgb(178, 178, 178);}
</style>
<path class="st1" d="M53.7,41.2l0.5,55.1c-2.2,0.8-4.7,0.8-6.8,0l2.8-55L53.7,41.2z"/>
<g id="turbines">	
	<path class="st2" d="M49.6,38.8L48.4,39c0,0-1.8,2.8-2.3,4.6c0,0-29.8,2.3-32.4,2c-1.4-0.2-1.2-1-0.7-1.2c0.5-0.2,36.4-7,36.4-7
		L49.6,38.8z"/>
	<path class="st2" d="M52.7,34.8l0.4-0.9c0,0-1.9-2.8-3.4-4.1c0,0,12.7-23.4,14.3-25.3c0.9-1,1.6-0.4,1.6,0.1
		S54.4,35.5,54.4,35.5L52.7,34.8z"/>
	<path class="st2" d="M54.8,38.9l0.7,0.8c0,0,3.9-0.2,5.9-0.7c0,0,16.8,21.5,17.7,23.7
		c0.5,1.2-0.4,1.4-0.9,1.2c-0.4-0.3-25.1-24-25.1-24L54.8,38.9z"/>	
  <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 51.8 38" to="360 51.8 38" dur="${
    value ? '2s' : '0s'
  }" additive="sum" repeatCount="indefinite" />
</g>
<circle class="st3" cx="51.8" cy="38" r="4"/>
<circle class="st4" cx="51.8" cy="38" r="3"/>
</svg>`;

  const xSize = 100 / 1.5;
  const ySize = 100 / 1.5;
  const xAnchor = xSize / 2;
  const yAnchor = ySize;

  const solarIcon = new L.Icon({
    iconUrl: windString,
    iconSize: [ySize, xSize], // size of the icon
    iconAnchor: [xAnchor, yAnchor] // point of the icon which will correspond to marker's location
  });

  return solarIcon;
};
