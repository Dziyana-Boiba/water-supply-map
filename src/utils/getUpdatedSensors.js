export const getUpdatedSensors = (sensors, value) => {
  const updatedSensors = {};

  for (let s of sensors) {
    updatedSensors[s] = { x: null, y: value };
  }

  return updatedSensors;
};
