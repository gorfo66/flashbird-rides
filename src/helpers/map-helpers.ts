// @ts-ignore
import * as L from "leaflet/dist/leaflet-src.esm";
import { Log } from "../models";
import { getSpeedZone, getSpeedZoneInfo } from "./ride-helpers";

export const createMap = (logs: Log[], domElement: any): void => {
  const map = L.map(domElement);

  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: null,
    minZoom: 1,
    maxZoom: 20
  }).addTo(map);

  const states = logs.map((log, index) => {
    const next = logs[index + 1];
    if (next) {
      return {
        type: 'Feature',
        properties: {
          speed: log.speed
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [log.longitude, log.latitude],
            [next.longitude, next.latitude]
          ]]
        }
      }
    }

    return undefined;
  }).filter(e => !!e);

  const path = L.geoJson(states, {
    style: function (feature: any) {
      const speed = feature.properties.speed;
      const color = getSpeedZoneInfo(getSpeedZone(speed)).color;

      return {
        weight: 5,
        color: color
      }
    }
  });

  path.addTo(map);
  map.fitBounds(path.getBounds());
}