/**
 * Fetch trips assigned to a driver from SharePoint
 * REPLACE listName with actual list
 * REPLACE column internal names if different
 */
export async function fetchTripsFromNintex(driverId) {
  // Nintex exposes form context globally
  const listName = "VanTrips"; // replace if needed

  const response = await window.NFDataServices.query({
    listName,
    filter: `DriverId eq '${driverId}' and Status ne 'Completed'`,
    columns: [
      "Id",
      "Title",
      "FromLocation",
      "ToLocation",
      "PickupTime",
      "CustomerName",
      "PickUpDate",
      "DropOffDate",
      "Status",
    ],
  });

  // Normalize for React
  return response.map((item) => ({
    id: item.Id,
    tripId: item.Title,
    from: item.FromLocation,
    to: item.ToLocation,
    time: item.PickupTime,
    customer: item.CustomerName,
    pickedUp: !!item.PickUpDate,
  }));
}

/**
 * Update a single field in SharePoint via Nintex
 */
export async function updateTripField(tripId, fieldName, value) {
  // fieldName MUST match column internal name
  await window.NFDataServices.updateItem({
    listName: "VanTrips", // replace
    itemId: tripId,
    values: {
      [fieldName]: value,
    },
  });
}
