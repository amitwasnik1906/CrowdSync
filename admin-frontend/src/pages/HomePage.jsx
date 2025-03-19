import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminRefreshToken } from '../apiServices';

function HomePage() {
  const navigate = useNavigate();
  const token = getAdminRefreshToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome to Bus Management System
          </h1>
          
          <div className="space-y-6">
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">About the System</h2>
              <p className="text-gray-600">
                This bus management system helps you track and manage your bus fleet efficiently. 
                You can manage routes, track buses, and monitor passenger information all in one place.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-gray-700 mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/bus/dashboard')}
                  className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <h3 className="font-medium text-gray-800">View Buses</h3>
                  <p className="text-sm text-gray-600">Check your fleet status</p>
                </button>
                <button 
                  onClick={() => navigate('/analytics')}
                  className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <h3 className="font-medium text-gray-800">View Analytics</h3>
                  <p className="text-sm text-gray-600">Get the analysis of routes and buses</p>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;