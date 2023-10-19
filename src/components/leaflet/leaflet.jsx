import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { SystemsContainer } from '../system/systems-container';

import darkmap from './../../assets/images/dark-map.jpg';
import lightmap from '../../assets/images/light-map.jpg';

import 'leaflet/dist/leaflet.css';

export const LeafletContainer = ({ data }) => {
  const [isBasemapLight, setIsBasemapLight] = useState(true);

  const basemap = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  return (
    <MapContainer
      style={{ height: '80vh' }}
      center={[40.620208, -8.608489]}
      minZoom={2}
      maxZoom={18}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        className='map-tiles'
        subdomains={'abcd'}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={isBasemapLight ? basemap.light : basemap.dark}
      />

      <button className='switch-mode-btn' onClick={() => setIsBasemapLight(prev => !prev)}>
        <img src={isBasemapLight ? darkmap : lightmap} width='50px' height='50px' alt='map view' />
      </button>

      <SystemsContainer data={data} />
    </MapContainer>
  );
};
