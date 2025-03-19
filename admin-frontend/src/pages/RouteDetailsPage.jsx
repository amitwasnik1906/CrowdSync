import React, { useEffect, useState } from 'react';
import { getRouteDetails } from '../apiServices';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import polyline from 'polyline';
import 'leaflet/dist/leaflet.css';

function RouteDetailsPage() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const data = await getRouteDetails(id);
        console.log(data);

        setRoute(data.route);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Decode the polyline into an array of latitude/longitude pairs
  const decodedPolyline = polyline.decode(route.route_polyline);

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Route Details</h1>
      <div>
        <p className="mb-1"><strong>Route Name:</strong> {route.route_name}</p>
        <p className="mb-1"><strong>Start Location:</strong> {route.start_location}</p>
        <p className="mb-1"><strong>End Location:</strong> {route.end_location}</p>
        <p className="mb-1"><strong>Departure Time:</strong> {route.departure_time}</p>
        <p className="mb-1"><strong>Status:</strong> {route.status}</p>
      </div>

      {/* Stops Section */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Stops</h2>
        <ul className="list-disc pl-5">
          {route.stops.stops.map((stop, index) => (
            <li key={index} className="mb-1">{stop.name}</li>
          ))}
        </ul>
      </div>

      {/* Map Section */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Route Map</h2>
        <div className="h-[600px] w-[90%] mx-auto rounded-lg overflow-hidden shadow-md">
          <MapContainer
            center={decodedPolyline[0]} // Center on the first coordinate
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={decodedPolyline} color="blue" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteDetailsPage;
