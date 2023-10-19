import { useCallback, useEffect, useState } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { ConsumptionPoint } from '../markers/consumption-point';
import { MonitoringPoint } from '../markers/monitoring-point';
import { PumpingStation } from './pumping-station';
import { Tank } from '../markers/tank-marker';
import { ClusterMarker } from '../markers/cluster-marker';
import { EnergyGeneratorMarker } from '../markers/energy-generator-marker';

export const Subsystem = ({ subsystem, sensorsValues, name }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  const onZoom = useCallback(() => {
    const currentZoom = map.getZoom();
    if ((currentZoom < 13 && zoom > 12) || (currentZoom > 12 && zoom < 14)) {
      setZoom(currentZoom);
    }
  }, [map, zoom]);

  useEffect(() => {
    map.on('zoomend', onZoom);

    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map, onZoom]);

  return zoom > 12 ? (
    <LayerGroup>
      {subsystem.tanks.map(t => (
        <Tank
          tank={t}
          pumpList={subsystem.pumpSt}
          sensorsValues={sensorsValues}
          key={'tank' + t.id}
        />
      ))}
      {subsystem.pumpSt.map((p, i) => (
        <PumpingStation pumpSt={p} index={i} sensorsValues={sensorsValues} key={'pumpst' + p.id} />
      ))}
      {subsystem.consP.map(c => (
        <ConsumptionPoint consPoint={c} sensorsValues={sensorsValues} key={'cons' + c.id} />
      ))}
      {subsystem.monP.map(m => (
        <MonitoringPoint monPoint={m} sensorsValues={sensorsValues} key={'mon' + m.id} />
      ))}
      {subsystem.solar_parks.map(s => (
        <EnergyGeneratorMarker generator={s} sensorsValues={sensorsValues} key={'energy' + s.id} />
      ))}
    </LayerGroup>
  ) : (
    <ClusterMarker subsystem={subsystem} sensorsValues={sensorsValues} />
  );
};
