export const updateValues = (valueobj, updatedSensors) => {
  Object.keys(valueobj).forEach(function (key) {
    const prev = valueobj[key].y ? valueobj[key].y : 0;
    const value = updatedSensors[key] ? updatedSensors[key].y : null;
    valueobj[key] = { y: value, prevValue: prev };
  });
  return valueobj;
};
