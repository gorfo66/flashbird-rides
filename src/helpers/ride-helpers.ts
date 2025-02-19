import { Log, Ride, SpeedZone } from "../models";
import { average, degreesToRadians } from "./data-helpers";


export const getSpeedArray = (ride: Ride): number[] | undefined => {
  return ride.logs?.map(log => log.speed);
}

export const getTiltArray = (ride: Ride): number[] | undefined => {
  return ride.logs?.map(log => log.tilt);
}


export const distanceInKmBetweenEarthCoordinates = (log1: Log, log2: Log) => {
  let lat1 = log1.latitude;
  const lon1 = log1.longitude;
  let lat2 = log2.latitude;
  const lon2 = log2.longitude;
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}


export const interpolate = (logs: Log[]): Log[] => {
  const step = Math.floor(logs.length / 500);

  if (step <= 1) {
    return logs;
  }

  let start = 0;
  const newlogs = [];
  while (start < logs.length) {

    const points = logs.slice(start, start + step);
    const averageSpeed = average(points.map((point) => point.speed))
    const averageTilt = average(points.map((point) => point.tilt));

    const newPoint = {
      ...logs[start],
      speed: averageSpeed,
      tilt: averageTilt
    }
    newlogs.push(newPoint);

    start = start + step;
  }

  newlogs.push(logs[logs.length - 1]);

  return newlogs;
}


export const getSpeedZone = (speed: number): SpeedZone => {
  if (speed > 130) {
    return SpeedZone.overlimit
  }

  if (speed > 90) {
    return SpeedZone.highway
  }

  if (speed > 50) {
    return SpeedZone.road;
  }

  return SpeedZone.city
}

export const getSpeedZoneInfo = (zone: SpeedZone): { color: string; title: string; description: string } => {
  switch (zone) {
    case SpeedZone.city: return {
      title: 'Ville',
      description: 'Vitesse inférieure ou égale à 50 km/h',
      color: 'blue'
    };
    case SpeedZone.road: return {
      title: 'Route',
      description: 'Vitesse entre 50 km/h et 90 km/h',
      color: 'darkorange'
    };
    case SpeedZone.highway: return {
      title: 'Voie rapide',
      description: 'Vitesse supérieure à 90 km/h',
      color: 'red'
    };
    case SpeedZone.overlimit: return {
      title: 'Hors limites',
      description: 'Vitesse supérieure à 130 km/h',
      color: 'black'
    };
  }
}