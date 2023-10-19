import { Marker, useMap } from 'react-leaflet';
import { createClusterCustomIcon } from '../svg/cluster-icon';

export const ClusterMarker = ({ subsystem, sensorsValues }) => {
  const map = useMap();
  return (
    <Marker
      position={subsystem.sublatlong}
      icon={createClusterCustomIcon(subsystem, sensorsValues)}
      riseOnHover={true}
      eventHandlers={{
        click: e => {
          map.setView(e.latlng, 14);
        }
      }}
    />
  );
};
