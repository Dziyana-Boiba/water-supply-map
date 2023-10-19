import L from 'leaflet';

export const solarSVG = () => {
  const solarString = `data:image/svg+xml;utf-8,
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100" >
<style type="text/css">
	.st1{fill:rgb(178, 178, 178);}
	.st2{fill:rgb(25, 25, 76);}
	.st0{fill:rgb(246, 243, 243);}
	.st3{fill: rgb(99, 95, 95);}
</style>
<path fill='rgb(178, 178, 178)' d="M50.5,99h-2.1c-1.1,0-3,0.1-3-1l1-41c0-1.1,0.9-2,2-2h2.1c1.1,0,2,0.9,2,2l2,41C54.5,99.1,51.6,99,50.5,99z"/>
<polygon class="st1" points="64.9,73.6 29.9,73.6 46.3,28.6 81.3,28.6 "/>
<polygon class="st2" points="63.6,71.6 32.6,71.6 47.6,30.6 78.6,30.6 "/>
<polygon class="st0" points="41.6,71.6 40.6,71.6 55.6,30.6 56.6,30.6 "/>
<polygon class="st0" points="55.6,71.6 54.6,71.6 69.6,30.6 70.6,30.6 "/>
<polygon class="st0" points="76.4,36.6 45.4,36.6 45.7,35.6 76.7,35.6 "/>
<polygon class="st0" points="65.5,66.6 34.5,66.6 34.8,65.6 65.8,65.6 "/>
<polygon class="st0" points="69.1,56.6 38.1,56.6 38.5,55.6 69.5,55.6 "/>
<polygon class="st0" points="72.7,46.6 41.7,46.6 42.1,45.6 73.1,45.6 "/>
<polygon class="st0" points="55.5,36.1 53.5,37.5 52.6,36.1 54.6,34.6 "/>
<polygon class="st0" points="48.2,56.1 46.3,57.5 45.4,56.1 47.3,54.6 "/>
<polygon class="st0" points="44.6,66.1 42.6,67.5 41.7,66.1 43.7,64.6 "/>
<polygon class="st0" points="58.6,66.1 56.6,67.5 55.7,66.1 57.7,64.6 "/>
<polygon class="st0" points="62.2,56.1 60.3,57.5 59.4,56.1 61.3,54.6 "/>
<polygon class="st0" points="65.8,46.1 63.9,47.5 63,46.1 64.9,44.6 "/>
<polygon class="st0" points="69.5,36.1 67.5,37.5 66.6,36.1 68.6,34.6 "/>
<polygon class="st0" points="51.8,46.1 49.9,47.5 49,46.1 50.9,44.6 "/>
<polygon class="st3" points="64.9,73.5 67,76 82.5,32 81.2,28.5 "/>
<polygon class="st3" points="67,76 32,76 29.9,73.6 65,73.6 "/>
</svg>`;

  const xSize = 100 / 1.5;
  const ySize = 100 / 1.5;
  const xAnchor = xSize / 2;
  const yAnchor = ySize;

  const solarIcon = new L.Icon({
    iconUrl: solarString,
    iconSize: [xSize, ySize], // size of the icon
    iconAnchor: [xAnchor, yAnchor] // point of the icon which will correspond to marker's location
  });

  return solarIcon;
};
