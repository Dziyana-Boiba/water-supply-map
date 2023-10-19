import {
  consPointType,
  infrType,
  monPointType,
  pumpStBooster,
  pumpStElevation,
  pumpStType,
  tankType
} from '../constants/types';

function findDeepest(obj) {
  if (obj.hasOwnProperty('next_connections') && obj.next_connections.length > 0) {
    obj.next_connections.forEach(connection => {
      findDeepest(connection);
    });
  } else {
    return typeof obj === 'string' ? obj : obj.uuid;
  }
}

export const convertData = systems => {
  const convertedSystems = [];

  for (let system of systems) {
    const subsystems = []; // List of subsystems
    const coordinatesList = []; // List of all elements with coordinates
    const pipes = []; // List of pipes to connect each element
    const subpipes = []; // List of pipes to connect subsystems
    const systemSensors = {}; // Object with sensors id (key) and object with current and previous values
    const subConnections = {}; // List of all connections for each subsystem

    for (let sub of system.subsystems) {
      subConnections[sub.id] = [];
      const subNodeIdList = []; // List of node IDs (uuid) of each element in subsystem

      const tanks = sub.infrastructures
        .filter(infr => infr.class_type?.toLowerCase() === tankType)
        .map(t => {
          subNodeIdList.push(t.node.uuid);
          const nextLastConnection = t.node.next_connections?.map(c =>
            typeof c === 'string' ? c : findDeepest(c.next_connections)
          );
          return {
            ...t,
            devices: t.tank_cells,
            class_type: t.class_type.toLowerCase(),
            minimum_level: 0,
            maximum_level: 5,
            next_last_connections: nextLastConnection,
            latlong: [t.node.latitude, t.node.longitude]
          };
        });

      const consP = sub.infrastructures
        .filter(infr => infr.class_type?.toLowerCase() === consPointType)
        .map(c => {
          subNodeIdList.push(c.node.uuid);
          return {
            ...c,
            class_type: c.class_type.toLowerCase(),
            latlong: [c.node.latitude, c.node.longitude]
          };
        });

      const monP = sub.infrastructures
        .filter(infr => infr.class_type?.toLowerCase() === monPointType)
        .map(m => {
          subNodeIdList.push(m.node.uuid);
          return {
            ...m,
            class_type: m.class_type.toLowerCase(),
            latlong: [m.node.latitude, m.node.longitude]
          };
        });

      const setPumpStType = connections => {
        const idFromNextSub = connections
          .map(c => (typeof c === 'string' ? c : findDeepest(c.next_connections)))
          .filter(id => !subNodeIdList.includes(id));
        return idFromNextSub.length > 0 ? 'none' : 'none';
      };

      let pumpSt = sub.infrastructures.filter(
        infr => infr.class_type?.toLowerCase() === pumpStType
      );
      pumpSt.forEach(p => subNodeIdList.push(p.node.uuid));

      let count = -3;
      pumpSt = pumpSt.map((p, i) => {
        const subtype =
          p.type.toLowerCase() === pumpStBooster
            ? p.type.toLowerCase()
            : setPumpStType(p.node.next_connections);

        count = pumpSt.length > 1 ? count + 2 : 0;

        const inputTank = tanks.find(t => t.next_last_connections.includes(p.node.uuid));

        return {
          ...p,
          devices: p.pumps,
          class_type: p.class_type.toLowerCase(),
          subtype: subtype,
          shift_index: {
            index: count,
            tankCells: inputTank ? inputTank.devices.length : 0
          },
          latlong:
            inputTank && subtype !== pumpStBooster
              ? inputTank.latlong
              : [p.node.latitude, p.node.longitude]
        };
      });

      const sublatlong =
        tanks.length > 0
          ? tanks[0].latlong
          : pumpSt.length > 0
          ? pumpSt[0].latlong
          : consP.length > 0
          ? consP[0].latlong
          : null;

      subsystems.push({
        id: sub.id,
        name: sub.name,
        sublatlong: sublatlong,
        tanks,
        pumpSt,
        consP,
        monP,
        solar_parks: sub.solar_parks
      });
    }

    function addSensor(id) {
      systemSensors[id] = {
        y: 0,
        prevValue: 0
      };
    }

    function addCoordAndSensors(elements, subID) {
      elements.forEach(el => {
        const sensorslist = [];

        el.sensors?.forEach(s => {
          addSensor(s.id);
          sensorslist.push(s.id);
        });

        el.devices?.forEach(c =>
          c.sensors.forEach(s => {
            addSensor(s.id);
            sensorslist.push(s.id);
          })
        );

        const subtype = el.class_type === pumpStType ? el.subtype : null;
        const shift_index = el.class_type === pumpStType ? el.shift_index : null;

        coordinatesList.push({
          id: el.id,
          nodeID: el.node.uuid,
          type: el.class_type,
          subID,
          sensorslist,
          subtype,
          latlong: el.latlong,
          output_devices: el.node.next_connections,
          shift_index
        });
      });
    }

    subsystems.forEach(sub => {
      addCoordAndSensors(sub.tanks, sub.id);
      addCoordAndSensors(sub.pumpSt, sub.id);
      addCoordAndSensors(sub.consP, sub.id);
      addCoordAndSensors(sub.monP, sub.id);

      sub.solar_parks.forEach(s => {
        s.sensors.forEach(s => addSensor(s.id));
      });
    });

    function extractCoordinates(obj) {
      let extraCoordinates = [];
      let deepestObj = obj;

      function extractAndFindDeepest(obj) {
        if (typeof obj === 'object') {
          extraCoordinates.push([obj.latitude, obj.longitude]);
        }
        if (typeof obj === 'string') {
          const el = coordinatesList.find(c => c.nodeID === obj);
          extraCoordinates.push(el.latlong);
        }

        if (obj.hasOwnProperty('next_connections') && obj.next_connections.length > 0) {
          obj.next_connections.forEach(connection => {
            extractAndFindDeepest(connection);
          });
        } else {
          deepestObj = obj;
        }
      }

      extractAndFindDeepest(obj);
      extraCoordinates.pop();
      return { extraCoordinates, deepestObj };
    }

    for (let el of coordinatesList) {
      if (el.output_devices.length > 0) {
        for (let output of el.output_devices) {
          if (typeof output === 'string') {
            subConnections[el.subID].push(output);
            let endCoord = coordinatesList.find(c => c.nodeID === output);
            if (endCoord) {
              pipes.push({
                startnode: el,
                endnode: endCoord,
                isOn: false
              });
            }
          }
          if (typeof output === 'object') {
            const { extraCoordinates, deepestObj } = extractCoordinates(output);
            const lastConnectionID = typeof deepestObj === 'object' ? deepestObj.uuid : deepestObj;
            subConnections[el.subID].push(lastConnectionID);
            let lastConnection = coordinatesList.find(c => c.nodeID === lastConnectionID);
            if (lastConnection) {
              pipes.push({
                startnode: el,
                between: extraCoordinates,
                endnode: lastConnection,
                isOn: false
              });
            }
          }
        }
      }
    }

    subsystems.forEach(s => {
      const subSensors = coordinatesList
        .filter(c => c.subID === s.id)
        .flatMap(c => c.sensorslist.flat());

      const subPipeStart = { latlong: s.sublatlong, sensors: subSensors };
      const subPipeEnd = coordinatesList.filter(
        c => subConnections[s.id].includes(c.nodeID) && c.subID !== s.id
      );

      subPipeEnd.forEach(p => {
        const subsys = subsystems.find(s => s.id === p.subID);
        const endSensors = coordinatesList
          .filter(c => c.subID === subsys.id)
          .flatMap(c => c.sensorslist.flat());

        subpipes.push({
          start: subPipeStart,
          end: { latlong: subsys.sublatlong, sensors: endSensors },
          isOn: false
        });
      });
    });

    convertedSystems.push({
      ...system,
      subsystems: subsystems,
      coordinatesList,
      pipes,
      subpipes,
      systemSensors
    });
  }

  return convertedSystems;
};
