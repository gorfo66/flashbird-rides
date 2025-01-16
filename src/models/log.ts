export interface Log {
  latitude: number;
  longitude: number;
  gpsTimestamp: number;
  speed: number;
  distance: number;
  tilt: number;
  altitude?: number;
}
