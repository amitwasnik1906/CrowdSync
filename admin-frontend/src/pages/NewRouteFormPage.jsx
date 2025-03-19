import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBusDetails, createRoute } from '../apiServices';
import OpenRouteServiceMap from '../components/MapComponent';

function NewRouteFormPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bus, setBus] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [stops, setStops] = useState([]);
  const [routePolyline, setRoutePolyline] = useState('');

  const handleMapDataChange = (stopsData, polylineData) => {
    setStops(stopsData);
    setRoutePolyline(polylineData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const data = await getBusDetails(id);
        setBus(data.bus);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  const handleCreateRoute = (e) => {
    e.preventDefault();
    if (!routePolyline || !stops.length) {
      alert("Please create a route with at least two stops");
      return;
    }
    createRoute({ 
      route_name: routeName, 
      start_location: startLocation, 
      end_location: endLocation, 
      departure_time: departureTime, 
      busId: id, 
      route_polyline: routePolyline, 
      stops: { stops } 
    });
    console.log(routePolyline);
    console.log(stops);
    

    alert("New Route Added");
    navigate(`/bus/${id}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg shadow-sm">
        <h3 className="font-semibold">Error fetching bus</h3>
        <p>{error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Bus Details Card */}
          {bus && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-blue-600">
                <h3 className="text-xl font-semibold text-white">Bus Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-500">Bus Number</p>
                  <p className="text-lg font-medium">{bus.bus_number}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Capacity</p>
                  <p className="text-lg font-medium">{bus.capacity}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Current Passengers</p>
                  <p className="text-lg font-medium">{bus.current_passenger_count || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Created At</p>
                  <p className="text-lg font-medium">{new Date(bus.created_at).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Current Location</p>
                  <p className="text-lg font-medium">
                    {bus.current_latitude !== null && bus.current_longitude !== null
                      ? `${bus.current_latitude}, ${bus.current_longitude}`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Route Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-600">
              <h2 className="text-xl font-semibold text-white">Create New Route</h2>
            </div>
            <form onSubmit={handleCreateRoute} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Route Name</label>
                  <input
                    type="text"
                    placeholder="Enter route name"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Departure Time</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Location</label>
                  <input
                    type="text"
                    placeholder="Enter start location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Location</label>
                  <input
                    type="text"
                    placeholder="Enter end location"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <hr />
              
              {/* Map Section */}
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-inner bg-gray-50">
                  <OpenRouteServiceMap handleMapDataChange={handleMapDataChange} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                >
                  Create New Route
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRouteFormPage;