// import { mockNintexAdapter } from "../mock/mockAdapter";
// import { fetchTripsFromNintex, updateTripField } from "./nintexAdapter";

// // Detect if running inside Nintex
// const isNintex = typeof window !== "undefined" && window.NFDataServices;

// /**
//  * Unified data adapter
//  * React never talks directly to Nintex
//  */
// export const dataAdapter = {
//   getTripsForDriver: async (driverId) => {
//     if (!isNintex) {
//       return mockNintexAdapter.getTripsForDriver(driverId);
//     }
//     return fetchTripsFromNintex(driverId);
//   },

//   pickUpTrip: async (tripId) => {
//     const timestamp = new Date().toISOString();

//     if (!isNintex) {
//       return mockNintexAdapter.updatePickUp(tripId, timestamp);
//     }

//     return updateTripField(tripId, "PickUpDate", timestamp);
//   },

//   dropOffTrip: async (tripId) => {
//     const timestamp = new Date().toISOString();

//     if (!isNintex) {
//       return mockNintexAdapter.updateDropOff(tripId, timestamp);
//     }

//     return updateTripField(tripId, "DropOffDate", timestamp);
//   },
// };

// For Nintex Use Only
import { fetchTripsFromNintex, updateTripField } from "./nintexAdapter";
import { mockNintexAdapter } from "../mock/mockAdapter";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export async function fetchTrips(driverId) {
  if (USE_MOCK) {
    return mockNintexAdapter.getTripsForDriver(driverId);
  }
  return fetchTripsFromNintex(driverId);
}

export async function pickUpTrip(tripId) {
  const timestamp = new Date().toISOString();

  if (USE_MOCK) {
    return mockNintexAdapter.updatePickUp(tripId, timestamp);
  }

  return updateTripField(tripId, "PickUpDate", timestamp);
}

export async function dropOffTrip(tripId) {
  const timestamp = new Date().toISOString();

  if (USE_MOCK) {
    return mockNintexAdapter.updateDropOff(tripId, timestamp);
  }

  return updateTripField(tripId, "DropOffDate", timestamp);
}
