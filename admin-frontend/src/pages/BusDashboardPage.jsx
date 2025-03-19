import React, { useState } from 'react';
import AllBuses from '../components/AllBuses';
import { createBus } from '../apiServices';


function BusDashboardPage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [busNumber, setBusNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleAddBus = async () => {
    // Logic to add the bus to the database goes here
    // For example, you might call an API to save the bus data
    console.log('Adding bus:', { busNumber, capacity });
    await createBus({
      bus_number: busNumber,
      capacity: capacity
    })

    // Reset form fields
    setBusNumber('');
    setCapacity('');
    setFormVisible(false);
  };

  return (
    <>
      <AllBuses />
      <button
        onClick={() => setFormVisible(true)}
        className="absolute top-20 right-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 z-10"
      >
        Add New Bus
      </button>

      {isFormVisible && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Add New Bus</h2>
            <input
              type="text"
              placeholder="Bus Number"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)} // Ensure it's an integer
              className="border p-2 mb-4 w-full"
            />
            <button
              onClick={handleAddBus}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              onClick={() => setFormVisible(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BusDashboardPage