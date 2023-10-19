import { Marker, Popup } from 'react-leaflet';
import { consumptionSVG } from '../svg/consumption-point-icon';

import './point-popup.scss';

export const ConsumptionPoint = ({ consPoint, sensorsValues }) => {
  return (
    <Marker
      position={consPoint.latlong}
      icon={consumptionSVG(consPoint.sensors, sensorsValues)}
      riseOnHover={true}
      className={'consumption-point'}
    >
      <Popup className='consumption-popup'>
        <div className='consumption-popup_title'>{consPoint.name}</div>
        <div className='consumption-popup_measurement'>
          {consPoint.sensors.length > 0 ? (
            <table>
              <tbody>
                {consPoint.sensors.map(s => (
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
                      <span className='consumption-popup_unit'>
                        {sensorsValues?.[s.id].y === null ? '' : s.measurement?.unit_short_pretty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='consumption-popup_sensor-alert'>No Sensors Found</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
