import { Log } from "./log";

export interface Ride {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  startDate: Date;
  endDate: Date;
  startLocation: string;
  endLocation: string;
  distance: number;
  logs?: Log[];
}


export enum SpeedZone {
  city,
  road,
  highway,
  overlimit
}
