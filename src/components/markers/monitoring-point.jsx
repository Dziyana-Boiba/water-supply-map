import { Marker, Popup } from 'react-leaflet';
import { monitoringPointDIV } from '../svg/monitoring-point-div-icon ';

import './point-popup.scss';

export const MonitoringPoint = ({ monPoint, sensorsValues }) => {
  return (
    <Marker
      position={monPoint.latlong}
      icon={monitoringPointDIV(monPoint.sensors, sensorsValues)}
      riseOnHover={true}
      className='monitoring-point'
    >
      <Popup className='monitoring-popup'>
        <div className='monitoring-popup_title'>{monPoint.name}</div>
        <div className='monitoring-popup_measurement'>
          {monPoint.sensors.length > 0 ? (
            <table>
              <tbody>
                {monPoint.sensors.map(s => (
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
                      <span className='monitoring-popup_unit'>
                        {sensorsValues?.[s.id].y === null ? '' : s.measurement?.unit_short_pretty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='monitoring-popup_sensor-alert'>No Sensors Found</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
