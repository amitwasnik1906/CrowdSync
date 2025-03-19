import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBusDetails, deleteRoute } from '../apiServices';

function BusDetailsPage() {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        const data = await getBusDetails(id)
        console.log(data.bus);

        setBus(data.bus);
        setRoutes(data.bus.routes);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [id]);

  const handleDelete = async (routeId) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await deleteRoute(routeId);
        setRoutes(routes.filter(route => route.id !== routeId));
      } catch (err) {
        setError(err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error fetching bus details: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bus Details</h1>
      {bus && (
        <div className="mb-4 p-5 border border-gray-300 rounded-lg shadow-md bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Bus Number: {bus.bus_number}</h3>
          <p className="mb-1"><strong>Capacity:</strong> {bus.capacity}</p>
          <p className="mb-1"><strong>Current Passengers:</strong> {bus.current_passenger_count || 0}</p>
          {/* <p className="mb-1"><strong>Created At:</strong> {new Date(bus.created_at).toLocaleString()}</p> */}
          <p className="mb-1"><strong>Current Latitude:</strong> {bus.current_latitude !== null ? bus.current_latitude : 'N/A'}</p>
          <p className="mb-1"><strong>Current Longitude:</strong> {bus.current_longitude !== null ? bus.current_longitude : 'N/A'}</p>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Available Routes</h2>
      {!routes.length ? <h2 className="text-red-500 font-semibold mb-4">No Route Available</h2> :
        <ul>
          {routes?.map(route => (
            <li key={route.id} className="mb-4 p-5 border border-gray-300 rounded-lg shadow-md bg-gray-100 flex justify-between items-center">
              <div>
                <p className="mb-1"><strong>Route Name:</strong> {route.route_name}</p>
                <p className="mb-1"><strong>Start Location:</strong> {route.start_location}</p>
                <p className="mb-1"><strong>End Location:</strong> {route.end_location}</p>
                <p className="mb-1"><strong>Departure Time:</strong> {route.departure_time}</p>
                <p className="mb-1"><strong>Status:</strong> {route.status}</p>
              </div>
              <div className='flex flex-col gap-3'>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2" onClick={() => navigate(`/route/${route.id}`)}>View</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => handleDelete(route.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      }

      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate(`/bus/route-form/${bus.id}`)}
        >
          Create New Route
        </button>
      </div>
    </div>
  );
}

export default BusDetailsPage;