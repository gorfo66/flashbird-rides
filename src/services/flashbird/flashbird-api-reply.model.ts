import { Ride } from "../../models"

export interface AuthenticationReply {
  data?: {
    signInWithEmailAndPassword?: {
      token: string
    }
  }
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