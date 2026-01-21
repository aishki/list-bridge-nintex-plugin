const mockTrips = [
  {
    id: "T001",
    driverId: "D123",
    from: "Location A",
    to: "Location B",
    time: "07:15 – 07:30",
    customer: "Jane Smith",
    pickedUp: false,
  },
  {
    id: "T002",
    driverId: "D123",
    from: "Location C",
    to: "Location D",
    time: "07:40 – 08:00",
    customer: "Clyde Magbanua",
    pickedUp: false,
  },
];

export const mockNintexAdapter = {
  getDriverInfo: async (driverId) => {
    return { id: driverId, name: "John Doe" };
  },

  getTripsForDriver: async (driverId) => {
    return mockTrips.filter((t) => t.driverId === driverId);
  },

  updatePickUp: async (tripId, timestamp) => {
    console.log("MOCK PickUp:", tripId, timestamp);
    const trip = mockTrips.find((t) => t.id === tripId);
    if (trip) trip.pickedUp = true;
  },

  updateDropOff: async (tripId, timestamp) => {
    console.log("MOCK DropOff:", tripId, timestamp);
  },
};
