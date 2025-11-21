import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/Fetch';
import { storeAuthToken, getUserData } from '../utils/authUtils';
import { LOGIN_API_URL } from '../utils/apiUrls';
import { SEO } from '../features/common/ui';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetchApi(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.authToken) {
        // Store the token with 90-day expiration
        storeAuthToken(response.authToken, response.user || {});
        
        // Redirect to admin page
        navigate('/admin');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      // console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admin Login - Ink Atelier"
        description="Secure admin login for Ink Atelier staff. Login with email address."
        keywords="admin login, ink atelier admin, staff login, customer management, tattoo studio admin, email admin login"
        image="/assets/images/logo.jpg"
        url="https://inkatelier.in/login"
        type="website"
      />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 py-10">
        <div className="w-full max-w-md flex flex-col items-center mb-6">
          <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Ink Atelier Logo" className="w-16 h-16 rounded-full border-4 border-white/20 mb-3 bg-white" />
          <h2 className="text-3xl font-bold text-white mb-1 text-center tracking-tight">Ink Atelier Admin</h2>
          <p className="text-base text-white/70 mb-3 text-center">Sign in to your account</p>
        </div>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl px-8 py-9 flex flex-col items-center">
          <form className="w-full space-y-6" onSubmit={handleSubmit} autoComplete="on">
            {error && (
              <div className="bg-rose-900/30 border border-rose-400 text-rose-200 px-4 py-2 rounded-xl text-center text-base mb-2">
                {error}
              </div>
            )}
            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-lg text-white placeholder-white/60 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-lg text-white placeholder-white/60 focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
              />
            </div>
            <div className="flex items-center mb-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-sky-400 border-white/25 rounded bg-white/10 mr-2 focus:ring-sky-400 transition"
              />
              <label htmlFor="remember-me" className="text-sm text-white/80">Remember me</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg shadow text-lg font-bold bg-white text-black border-white/60 border-2 hover:bg-gray-100 transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-white/60 mb-3">
              Don&apos;t have an account? Contact us to get access.
            </p>
            <a
              href="https://wa.me/9636301625"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sky-200 hover:text-sky-400 text-sm font-semibold"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 