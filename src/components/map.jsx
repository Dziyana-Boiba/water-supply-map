import { useEffect, useState } from 'react';
import { LeafletContainer } from './leaflet/leaflet';
import { Loading } from './global/loader/loading';
import { convertData } from '../utils/convert-data';

import dataJSON from '../data/network_map_data.json';

import './map.scss';

export const Map = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      //setIsLoading(true);
      try {
        //const response = await fetch(/* `${API_BASE_URL}/data` */);
        const systemsArray = convertData(dataJSON.systems);
        console.log(systemsArray);
        setData(systemsArray);
      } catch (error) {
        // error handler
      }
      //setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className='map-container'>
      {isLoading ? <Loading /> : <LeafletContainer data={data} />}
    </div>
  );
};
