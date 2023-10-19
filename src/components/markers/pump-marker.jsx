import { useCallback, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { flowType, pumpStElevation } from '../../constants/types';
import { pumpStIcon } from '../svg/pump-icon';

const colors = {
  void: 'rgb(77,77, 77)',
  pipeWater: 'rgb(8, 94, 141)',
  border: 'rgb(178, 178, 178)',
  sensorBroken: 'rgb(232, 170, 66)',
  pumpWorking: 'rgb(93, 156, 89)',
  pumpStop: 'rgb(179, 48, 48)'
};

export const PumpStMarker = ({ position, pumpSt, sensorsValues }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const onRefChange = useCallback(node => {
    if (node) {
      setIsPopupOpen(node.isOpen());
    }
  }, []);

  const stationType = pumpSt.subtype.toLowerCase();

  const pumpStFlowSensor = pumpSt.sensors?.find(
    s => s.measurement?.type.toLowerCase() === flowType
  );
  const pumpStFlowUnit = pumpStFlowSensor ? pumpStFlowSensor.measurement?.unit_short_pretty : '';
  const pumpStFlowValue = pumpStFlowSensor ? sensorsValues?.[pumpStFlowSensor.id].y : 0;

  // 6 is width of one number character, 4 is width of  one unit character, 13 is gap between number and unit (3 px) + padding (10 px)
  const valueWidth =
    pumpStFlowSensor && sensorsValues?.[pumpStFlowSensor.id].y === null
      ? 25
      : String(pumpStFlowValue).length * 6 + pumpStFlowUnit.length * 3 + 13;

  //pumps.length * 16 + 4 === pumps.length * 14 + (pumps.length - 1) * 2 + 6
  //where 14 is pump width, 2 is gap between two pumps, 6 is padding (3px left and 3px right)
  const pumpsWidth = pumpSt.devices.length * 16 + 4;

  const pumpStWidth = Math.max(pumpsWidth, valueWidth);

  //11 is 16 (pipe width + node width) - 5 (xAncor shift in icon)
  const popupAncorX = stationType === pumpStElevation ? pumpStWidth / 2 + 11 : 0;

  const popupClassName = `pump-popup ${stationType} ${pumpStFlowSensor ? 'withflow' : ''}`;

  const isPumpStOn = pumpSt.sensors?.filter(s => sensorsValues?.[s.id].y > 0).length > 0;
  const isSomeSensorBroken =
    pumpSt.sensors?.filter(s => sensorsValues?.[s.id].y === null).length > 0;

  const setPumpColor = sensors => {
    let color = colors.border;
    if (sensors && sensors.length > 0) {
      color =
        sensors.filter(s => sensorsValues?.[s.id].y === null).length > 0
          ? colors.sensorBroken
          : sensors.filter(s => sensorsValues?.[s.id].y > 0).length > 0
          ? colors.pumpWorking
          : colors.pumpStop;
    } else {
      color = isSomeSensorBroken
        ? colors.sensorBroken
        : isPumpStOn
        ? colors.pumpWorking
        : colors.pumpStop;
    }
    return color;
  };

  return (
    <Marker
      position={position}
      icon={pumpStIcon(
        pumpSt.devices,
        pumpSt.sensors,
        sensorsValues,
        stationType,
        pumpStWidth,
        isPopupOpen
      )}
      riseOnHover={true}
      className={'pump'}
    >
      <Popup className={popupClassName} offset={[popupAncorX, 0]} ref={onRefChange}>
        <div className='pump-popup_name'>{pumpSt.name}</div>
        <div className='pump-popup_station'>
          <span className='pump-popup_title'>Pumping Station:</span>
          {pumpSt.sensors?.length > 0 ? (
            <table>
              <tbody>
                {pumpSt.sensors.map(s => (
                  <tr key={s.id}>
                    <th>{s.measurement?.name}</th>
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
                      <span className='pump-popup_unit'>
                        {sensorsValues?.[s.id].y === null ? '' : s.measurement?.unit_short_pretty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='pump-popup_sensor-alert'>No Sensors Found</div>
          )}
        </div>
        <div className='pump-popup_pumps'>
          <span className='pump-popup_title'>Pumps:</span>
          {pumpSt.devices?.map((p, i) => (
            <div className='pump-popup_single-pump' key={p.id}>
              <div
                className='pump-popup_pump-number'
                style={{
                  backgroundColor: `${setPumpColor(p.sensors)}`
                }}
              >
                {i + 1}
              </div>
              {p.sensors.length > 0 ? (
                <table>
                  <tbody>
                    {p.sensors?.map(s => (
                      <tr key={s.id}>
                        <th>{s.measurement.name}</th>
                        <td
                          style={{
                            backgroundColor: `${
                              sensorsValues?.[s.id].y === null
                                ? 'rgba(232, 170, 66, 0.25)'
                                : sensorsValues?.[s.id].y > 0
                                ? 'rgba(93, 156, 89, 0.2)'
                                : 'rgba(179, 48, 48, 0.2)'
                            }`
                          }}
                        >
                          {sensorsValues?.[s.id].y === null
                            ? 'not available'
                            : sensorsValues?.[s.id].y}
                          <span className='pump-popup_unit'>
                            {sensorsValues?.[s.id].y === null
                              ? ''
                              : s.measurement?.unit_short_pretty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='pump-popup_sensor-alert'>No Sensors Found</div>
              )}
            </div>
          ))}
        </div>
      </Popup>
    </Marker>
  );
};
