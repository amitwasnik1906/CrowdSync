import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutAdmin } from '../apiServices';
import { getAdminRefreshToken } from '../apiServices';

function Header() {
    const navigate = useNavigate()
    const token = getAdminRefreshToken()

    const handleLogin = () => {
        navigate('/login')
    };

    const handleLogout = async () => {
        await logoutAdmin();
        // alert("Logout successful!");
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 p-4 flex justify-between items-center">
            <Link to="/" className="text-white text-2xl">Bus Sync</Link>
            <div className='flex gap-4'>
                <Link to="/bus/dashboard" className="text-white hover:underline">Bus Dashboard</Link>
                <Link to="/analytics" className="text-white hover:underline">Analytics</Link>
                {/* <Link to="/route/dashboard" className="text-white hover:underline">Route Dashboard</Link> */}
            </div>
            <div className="flex gap-4">

                <div className="flex gap-2">
                    {
                        !token ?
                            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Login</button> :
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;
