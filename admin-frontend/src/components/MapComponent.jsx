import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import polyline from "polyline";


const OpenRouteServiceMap = ({ handleMapDataChange }) => {
    const [locations, setLocations] = useState([{ name: "", coords: null }]);
    const [suggestions, setSuggestions] = useState({});
    const [route, setRoute] = useState([]);

    const API_KEY = import.meta.env.VITE_APP_ORSM_API_KEY;

    // Existing fetch functions remain the same
    const fetchSuggestions = async (query, index) => {
        if (query.length < 3) return;
        try {
            const response = await axios.get(
                `https://api.openrouteservice.org/geocode/autocomplete`,
                {
                    params: { api_key: API_KEY, text: query },
                }
            );
            setSuggestions((prev) => ({ ...prev, [index]: response.data.features }));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const fetchRoute = async () => {
        const validCoords = locations
            .filter((loc) => loc.coords)
            .map((loc) => loc.coords);

        if (validCoords.length < 2) {
            alert("Please select at least two locations.");
            return;
        }

        try {
            const response = await axios.post(
                `https://api.openrouteservice.org/v2/directions/driving-car`,
                {
                    coordinates: validCoords,
                    instructions: false, // Remove if you want turn-by-turn instructions
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: API_KEY,
                    },
                }
            );

            const decodedRoute = polyline.decode(response.data.routes[0].geometry);

            // Convert to Leaflet format (lat, lng)
            const formattedRoute = decodedRoute.map(([lat, lng]) => ({ lat, lng }));

            // Set the route state
            setRoute(formattedRoute);

            // Call the callback function with stops and polyline data
            const stopsData = locations
                .filter(loc => loc.coords)
                .map(loc => ({
                    name: loc.name,
                    latitude: loc.coords[1],
                    longitude: loc.coords[0]
                }));
            const polylineData = response.data.routes[0].geometry;
            handleMapDataChange(stopsData, polylineData);
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };


    const addLocation = () => {
        setLocations([...locations, { name: "", coords: null }]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-slate-700 p-3 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Plan Your Route</h2>

                            {/* Location Inputs */}
                            <div className="space-y-2">
                                {locations.map((location, index) => (
                                    <div key={index} className="relative">
                                        <input
                                            type="text"
                                            placeholder={`Location ${index + 1}`}
                                            value={location.name}
                                            onChange={(e) => {
                                                const newLocations = [...locations];
                                                newLocations[index].name = e.target.value;
                                                setLocations(newLocations);
                                                fetchSuggestions(e.target.value, index);
                                            }}
                                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                                        />

                                        {/* Suggestions Dropdown */}
                                        {suggestions[index]?.length > 0 && (
                                            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {suggestions[index].map((place, i) => (
                                                    <li
                                                        key={i}
                                                        onClick={() => {
                                                            const newLocations = [...locations];
                                                            newLocations[index] = {
                                                                name: place.properties.label,
                                                                coords: place.geometry.coordinates,
                                                            };
                                                            setLocations(newLocations);
                                                            setSuggestions((prev) => ({ ...prev, [index]: [] }));
                                                        }}
                                                        className="px-3 py-1.5 hover:bg-blue-50 cursor-pointer text-gray-700 text-xs border-b border-gray-100 last:border-0"
                                                    >
                                                        {place.properties.label}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-4 pt-4 ">
                                <div
                                    onClick={addLocation}
                                    className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                                >
                                    Add Stop
                                </div>
                                <div
                                    onClick={fetchRoute}
                                    disabled={locations.length < 2}
                                    className={`cursor-pointer flex-1 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm
                                        ${locations.length < 2
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                >
                                    Get Route
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px]">
                            <MapContainer
                                center={[20, 77]}
                                zoom={5}
                                className="h-full w-full"
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {locations
                                    .filter((loc) => loc.coords)
                                    .map((loc, i) => (
                                        <Marker
                                            key={i}
                                            position={{ lat: loc.coords[1], lng: loc.coords[0] }}
                                        />
                                    ))}
                                {route.length > 0 && <Polyline positions={route?.map(({ lat, lng }) => [lat, lng])} color="blue" />}

                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpenRouteServiceMap;