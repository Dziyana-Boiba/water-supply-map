import { LayerGroup } from 'react-leaflet';
import { Subsystem } from './subsystem';
import { Pipes } from './pipe';
import { useEffect, useState } from 'react';
import { getUpdatedSensors } from '../../utils/getUpdatedSensors';
import { updateValues } from '../../utils/update-values';

export const System = ({ system }) => {
  const [sensorsValues, setSensorsValues] = useState({ ...system.systemSensors });
  const [isSystemRemoved, setIsSystemRemoved] = useState(false);
  const sensorsId = Object.keys(system.systemSensors);

  const getSensorsValues = async value => {
    try {
      //const response = await fetch(/* `${API_BASE_URL}`, system.sensorsID */);
      const response = getUpdatedSensors(sensorsId, value); // getUpdatedSensors() used for testing without api call

      const updatedValues = updateValues(sensorsValues, response);

      setSensorsValues(prev => ({ ...updatedValues }));
    } catch (error) {
      // error handler
    }
  };

  useEffect(() => {
    getSensorsValues(0);

    let value = 0; // value used for testing without api call

    const intervalCall = setInterval(() => {
      if (isSystemRemoved) {
        clearInterval(intervalCall);
        return;
      }
      value = value + 1; // value used for testing without api call
      getSensorsValues(value);
    }, 10000);

    return () => {
      clearInterval(intervalCall);
    };
  }, [isSystemRemoved]);

  return (
    <LayerGroup
      eventHandlers={{
        add: e => {
          //console.log('Added Layer:', system.identifier);
          setIsSystemRemoved(false);
        },
        remove: e => {
          //console.log('Removed layer:', system.identifier);
          setIsSystemRemoved(true);
        }
      }}
    >
      {system.subsystems.map(sub => (
        <Subsystem
          subsystem={sub}
          sensorsValues={sensorsValues}
          key={'subsystem' + sub.id}
          name={system.identifier}
        />
      ))}
      <Pipes pipes={system.pipes} subpipes={system.subpipes} sensorsValues={sensorsValues} />
    </LayerGroup>
  );
};
