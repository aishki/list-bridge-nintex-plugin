import React, { useEffect, useState } from "react";
import Modal from "react-modal";
//import { fetchTripsFromNintex, updateTripField } from "../nintexAdapter";
import { dataAdapter } from "../dataAdapter";

// Required for react-modal accessibility
Modal.setAppElement("#root");

export default function DriverTrips({ driverId }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * LOAD TRIPS ASSIGNED TO THIS DRIVER
   * Re-runs if QR driverId changes
   */
  // useEffect(() => {
  //   async function loadTrips() {
  //     const data = await fetchTripsFromNintex(driverId);
  //     setTrips(data);
  //   }
  //   loadTrips();
  // }, [driverId]);

  useEffect(() => {
    async function loadTrips() {
      const data = await dataAdapter.getTripsForDriver(driverId);
      setTrips(data);
    }
    loadTrips();
  }, [driverId]);

  /**
   * Trigger confirmation modal
   */
  const handlePickUpClick = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  /**
   * CONFIRM PICK UP
   * Updates SharePoint PickUpDate column
   */
  // const confirmPickUp = async () => {
  //   await updateTripField(
  //     selectedTrip.id,
  //     "PickUpDate", // 🔁 SharePoint INTERNAL column name
  //     new Date().toISOString(),
  //   );

  //   setTrips((prev) =>
  //     prev.map((t) =>
  //       t.id === selectedTrip.id ? { ...t, pickedUp: true } : t,
  //     ),
  //   );

  //   setShowModal(false);
  // };

  const confirmPickUp = async () => {
    await dataAdapter.pickUpTrip(selectedTrip.id);

    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTrip.id ? { ...t, pickedUp: true } : t,
      ),
    );

    setShowModal(false);
  };

  /**
   * DROP OFF
   * Updates DropOffDate and removes trip from UI
   */
  // const handleDropOff = async (trip) => {
  //   await updateTripField(
  //     trip.id,
  //     "DropOffDate", // SharePoint INTERNAL column name
  //     new Date().toISOString(),
  //   );

  //   setTrips((prev) => prev.filter((t) => t.id !== trip.id));
  //   setSelectedTrip(null);
  // };

  const handleDropOff = async (trip) => {
    await dataAdapter.dropOffTrip(trip.id);

    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
    setSelectedTrip(null);
  };

  return (
    <div>
      {/* DRIVER HEADER */}
      <div style={{ marginBottom: 16 }}>
        <h2>Assigned Trips</h2>
        <p>Driver ID: {driverId}</p>
        <p>Trips found: {trips.length}</p>
      </div>

      {/* SINGLE TRIP VIEW */}
      {selectedTrip ? (
        <div className="trip-detail">
          <button onClick={() => setSelectedTrip(null)}>✕ Back</button>

          <h3>
            {selectedTrip.from} → {selectedTrip.to}
          </h3>
          <p>Time: {selectedTrip.time}</p>
          <p>Customer: {selectedTrip.customer}</p>

          {!selectedTrip.pickedUp ? (
            <button onClick={() => handlePickUpClick(selectedTrip)}>
              Pick Up
            </button>
          ) : (
            <button onClick={() => handleDropOff(selectedTrip)}>
              Drop Off
            </button>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="trip-list">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="trip-card"
              onClick={() => setSelectedTrip(trip)}
              style={{
                border: "1px solid #ccc",
                padding: 12,
                marginBottom: 10,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <strong>
                {trip.from} → {trip.to}
              </strong>
              <p>{trip.time}</p>
              <p>{trip.customer}</p>

              {!trip.pickedUp ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePickUpClick(trip);
                  }}
                >
                  Pick Up
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropOff(trip);
                  }}
                >
                  Drop Off
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          content: {
            maxWidth: 400,
            margin: "auto",
          },
        }}
      >
        <h3>Confirm Pick Up</h3>
        <p>
          {selectedTrip?.from} → {selectedTrip?.to}
        </p>
        <p>Time: {selectedTrip?.time}</p>

        <button onClick={() => setShowModal(false)}>Cancel</button>
        <button onClick={confirmPickUp}>Yes, Pick Up</button>
      </Modal>
    </div>
  );
}
