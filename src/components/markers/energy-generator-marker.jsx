import { Marker, Popup, Tooltip } from 'react-leaflet';
import { solarSVG } from '../svg/solar-energy-icon';
import { windSVG } from '../svg/wind-energy-icon';
import { solarEnergyType } from '../../constants/types';

import './energy-generator.scss';

export const EnergyGeneratorMarker = ({ generator, sensorsValues }) => {
  console.log(generator, 'energy generator');
  const powerSensor = generator.sensors.find(s => s.measurement.type.toLowerCase() === 'power');
  const powerValue = powerSensor ? sensorsValues[powerSensor.id].y : 0;
  const svg = generator.type.toLowerCase() === solarEnergyType ? solarSVG() : windSVG(powerValue);
  const offset = generator.type.toLowerCase() === solarEnergyType ? [8, -50] : [0, -70];
  return (
    <Marker position={[generator.node.latitude, generator.node.longitude]} icon={svg}>
      <Tooltip offset={offset} direction='top' permanent={true} className='energy-tooltip'>
        {generator.sensors.length > 0 ? (
          <>
            <span className='value'>
              {sensorsValues?.[generator.sensors[0].id].y === null
                ? 'N/A'
                : sensorsValues?.[generator.sensors[0].id].y}
            </span>
            <span className='unit'>
              {sensorsValues?.[generator.sensors[0].id].y === null
                ? ''
                : generator.sensors[0].measurement?.unit_short_pretty}
            </span>
          </>
        ) : (
          'No data'
        )}
      </Tooltip>
      <Popup className='energy-popup'>
        <div className='energy-popup_title'>{generator.name}</div>
        <div className='energy-popup_measurement'>
          {generator.sensors.length > 0 ? (
            <table>
              <tbody>
                {generator.sensors.map(s => (
                  <tr key={s.id}>
                    <th>{s.measurement.name}</th>
                    <td
                      style={{
                        backgroundColor: `${
                          sensorsValues?.[s.id].y === null
                            ? 'rgba(232, 170, 66, 0.2)'
                            : sensorsValues?.[s.id].y > 0
                            ? 'rgba(93, 156, 89, 0.2)'
                            : 'rgba(179, 48, 48, 0.2)'
                        }`
                      }}
                    >
                      {sensorsValues?.[s.id].y === null ? 'not available' : sensorsValues?.[s.id].y}
                      <span className='energy-popup_unit'>
                        {sensorsValues?.[s.id].y === null ? '' : s.measurement?.unit_short_pretty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='energy-popup_sensor-alert'>No Sensors Found</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
