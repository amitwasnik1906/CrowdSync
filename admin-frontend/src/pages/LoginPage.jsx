import React, { useEffect, useState } from 'react';
import { loginAdmin } from '../apiServices';
import { useNavigate } from 'react-router-dom';


function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    const data = await loginAdmin(formData)
    alert("Login Sucessful")
    navigate('/')
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;