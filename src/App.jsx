import DriverTrips from "./components/DriverTrips";

export default function App() {
  /**
   * QR CODE FLOW
   * Example QR URL:
   * https://company-site/nintex/van?driverId=D123
   *
   * driverId is NOT a domain account
   * This is a logical identifier stored in SharePoint
   */
  const params = new URLSearchParams(window.location.search);
  const driverId = params.get("driverId");

  if (!driverId) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No Driver ID found</h2>
        <p>Please scan your assigned QR code.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <DriverTrips driverId={driverId} />
    </div>
  );
}
