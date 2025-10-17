import {
  Ride
} from "./ride"

export interface AuthenticationReply {
  data?: {
    signInWithEmailAndPassword?: {
      token: string
    }
  }
}

export interface AuthenticationResult {
  token: string | undefined;
  error?: string | undefined
}


export interface GetRidesReply {
  data: {
    user: {
      devices: {
        rides: Ride[]
      }[]
    }
  }
}

export interface GetRideReply {
  data: {
    user: {
      ride: Ride
    }
  }
}

export interface ExportReply {
  data: {
    exportToGPX: boolean
  }
}