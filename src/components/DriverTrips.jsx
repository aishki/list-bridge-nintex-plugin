import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { fetchTrips, pickUpTrip, dropOffTrip } from "../adapters/dataAdapter";

// Required for react-modal accessibility
Modal.setAppElement("#root");

export default function DriverTrips({ driverId }) {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Load trips when driverId changes (QR scan)
   */
  useEffect(() => {
    if (!driverId) return;

    async function loadTrips() {
      const data = await fetchTrips(driverId);
      setTrips(data);
    }

    loadTrips();
  }, [driverId]);

  /**
   * Open confirmation modal
   */
  const handlePickUpClick = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  /**
   * Confirm Pick Up
   */
  const confirmPickUp = async () => {
    await pickUpTrip(selectedTrip.id);

    setTrips((prev) =>
      prev.map((t) =>
        t.id === selectedTrip.id ? { ...t, pickedUp: true } : t,
      ),
    );

    setShowModal(false);
  };

  /**
   * Drop Off
   */
  const handleDropOff = async (trip) => {
    await dropOffTrip(trip.id);

    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
    setSelectedTrip(null);
  };

  return (
    <div>
      <h2>Assigned Trips</h2>
      <p>Driver ID: {driverId}</p>
      <p>Trips found: {trips.length}</p>

      {/* SINGLE TRIP VIEW */}
      {selectedTrip ? (
        <div>
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
        <div>
          {trips.map((trip) => (
            <div
              key={trip.id}
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

      {/* CONFIRM MODAL */}
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
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
