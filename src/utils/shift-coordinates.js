import { pumpStElevation } from '../constants/types';

export const shiftCoordinates = (coord, type, shift, zoom) => {
  const shiftIndex = zoom > 14 ? Math.pow(2, 18 - zoom) : 16;
  const extaMetersLat = type ? (type.toLowerCase() === pumpStElevation ? 0 : -15 * shiftIndex) : 0;
  const extaMetersLong = type
    ? type.toLowerCase() === pumpStElevation
      ? shift.tankCells * 10 * shiftIndex
      : shift.index * 40 * shiftIndex
    : 0;

  const earth = 6378.137; //radius of the earth in kilometer
  const pi = Math.PI;
  const m_lat = 1 / (((2 * pi) / 360) * earth) / 1000; //1 meter in degree

  const new_latitude = coord[0] + extaMetersLat * m_lat;

  const cos = Math.cos;
  const m_long = 1 / (((2 * pi) / 360) * earth) / 1000; //1 meter in degree

  const new_longitude = coord[1] + (extaMetersLong * m_long) / (cos(coord[0] * (pi / 180)) + 1e-12);

  return [new_latitude, new_longitude];
};
