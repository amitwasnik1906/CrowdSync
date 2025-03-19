import React, { useEffect, useState } from 'react';
import { getAllBus, deleteBus } from '../apiServices';
import { useNavigate } from 'react-router-dom';

function AllBuses() {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const data = await getAllBus();
                setBuses(data.buses);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBuses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteBus(id);
            setBuses(buses.filter(bus => bus.id !== id));
            console.log("clicked");
            
        } catch (err) {
            setError(err);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">Error fetching buses: {error.message}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Buses</h1>
            <ul>
                {buses && buses.map(bus => (
                    <li key={bus.id} className="mb-4 p-5 border border-gray-300 rounded-lg shadow-md bg-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Bus Number: {bus.bus_number}</h3>
                            <p className="mb-1"><strong>Capacity:</strong> {bus.capacity}</p>
                            <p className="mb-1"><strong>Current Passengers:</strong> {bus.current_passenger_count || 0}</p>
                        </div>
                        <div className="flex gap-4 flex-col">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => navigate(`/bus/${bus.id}`)}>View</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => {
                                if (window.confirm("Are you sure you want to delete this bus?")) {
                                    handleDelete(bus.id);
                                }
                            }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllBuses