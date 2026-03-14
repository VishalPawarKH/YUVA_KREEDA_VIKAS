import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">Yuva Kreeda Vikas</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-emerald-200 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-emerald-200 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-emerald-200 transition-colors">Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-emerald-200 transition-colors">Dashboard</Link>
                <div className="flex items-center space-x-4 ml-4 border-l border-emerald-600 pl-4">
                  <span className="text-sm text-emerald-100">Hi, {user.name}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4 border-l border-emerald-600 pl-4">
                <Link to="/login" className="hover:text-emerald-200 transition-colors">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-emerald-200 hover:bg-emerald-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-emerald-700">Home</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-emerald-700">About Us</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md hover:bg-emerald-700">Contact</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md hover:bg-emerald-700">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-emerald-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-emerald-700">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md hover:bg-emerald-700">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
