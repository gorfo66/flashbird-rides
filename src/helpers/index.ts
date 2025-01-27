import { Log, Ride } from "../models";

export const average = (arr: number[] | undefined): number => {
  if (!!arr) {
    return arr.reduce((a, b) => { return a + b }, 0) / arr.length;
  }

  console.error('no array');
  return NaN
}



export const interpolate = (logs: Log[]): Log[] => {
  const step = Math.floor(logs.length / 500);

  console.log(logs.length, step);
  if (step <= 1) {
    return logs;
  }

  let start = 0;
  let newlogs = [];
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

  console.log(newlogs.length);
  return newlogs;
}


export const distanceInKmBetweenEarthCoordinates = (log1: Log, log2: Log) => {
  let lat1 = log1.latitude;
  let lon1 = log1.longitude;
  let lat2 = log2.latitude;
  let lon2 = log2.longitude;
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}


export const degreesToRadians = (degrees: number) => {
  return degrees * Math.PI / 180;
}


export const getSpeedArray = (ride: Ride): number[] | undefined => {
  return ride.logs?.map(log => log.speed);
}

export const getTiltArray = (ride: Ride): number[] | undefined => {
  return ride.logs?.map(log => log.tilt);
}


export const max = (arr: number[] | undefined): number => {
  if (!!arr) {
    return Math.max(...arr);
  }

  return NaN
}