import { LayersControl } from 'react-leaflet';
import { System } from './system';

export const SystemsContainer = ({ data }) => {
  return (
    <LayersControl position='topright'>
      {data &&
        data.map(s => (
          <LayersControl.Overlay checked name={s.name} key={'system' + s.id}>
            <System system={s} />
          </LayersControl.Overlay>
        ))}
    </LayersControl>
  );
};
