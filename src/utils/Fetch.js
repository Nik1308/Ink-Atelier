import { useEffect, useState } from "react";
import { getAuthToken, clearAuthData } from "./authUtils";

/**
 * Usage:
 * <Fetch url="/api/endpoint">
 *   {({ data, loading, error }) => ...}
 * </Fetch>
 */
const Fetch = ({ url, options, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setData(null);
    
    // Add authentication token if available
    const token = getAuthToken();
    const fetchOptions = { ...options };
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    
    fetch(url, fetchOptions)
      .then((res) => {
        // Handle 401/403 unauthorized/forbidden errors
        if (res.status === 401 || res.status === 403) {
          // Clear all authentication data
          clearAuthData();
          
          // Clear all localStorage
          localStorage.clear();
          
          // Redirect to login page
          window.location.href = '/login';
          
          throw new Error('Unauthorized. Please login again.');
        }
        
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return children({ data, loading, error });
};

export default Fetch; 

/**
 * Utility function for imperative API calls
 * Usage: await fetchApi(url, options)
 */
export async function fetchApi(url, options = {}) {
  const fetchOptions = { ...options };
  
  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  // If body is FormData, remove Content-Type header so browser sets it
  if (fetchOptions.body instanceof FormData && fetchOptions.headers) {
    const headers = { ...fetchOptions.headers };
    if (headers["Content-Type"]) {
      delete headers["Content-Type"];
    }
    fetchOptions.headers = headers;
  }
  
  // Log request details for debugging
  const requestLog = {
    method: fetchOptions.method || 'GET',
    url,
    headers: fetchOptions.headers,
    body: fetchOptions.body instanceof FormData ? '[FormData]' : fetchOptions.body,
  };
  console.group(`🔵 API Request: ${requestLog.method} ${url}`);
  console.log('Request Details:', requestLog);
  
  try {
    const res = await fetch(url, fetchOptions);
    
    // Log response details
    const responseLog = {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries()),
    };
    console.log('Response Status:', responseLog);
    
    // Clone response to read body without consuming it
    const responseClone = res.clone();
    let responseData = null;
    
    try {
      responseData = await res.json();
      console.log('Response Data:', responseData);
    } catch (e) {
      // If not JSON, try text
      try {
        const text = await responseClone.text();
        console.log('Response Text:', text);
        responseData = text;
      } catch (e2) {
        console.log('Response: [Unable to parse]');
      }
    }
    
    if (!res.ok) {
      // Handle 401/403 unauthorized/forbidden errors
      if (res.status === 401 || res.status === 403) {
        console.error('❌ Unauthorized/Forbidden - Logging out user');
        console.groupEnd();
        
        // Clear all authentication data
        clearAuthData();
        
        // Clear all localStorage
        localStorage.clear();
        
        // Redirect to login page
        window.location.href = '/login';
        
        // Throw error to prevent further execution
        const error = new Error('Unauthorized. Please login again.');
        error.status = res.status;
        error.statusText = res.statusText;
        throw error;
      }
      
      let message = `Error: ${res.status} ${res.statusText}`;
      let errorData = null;
      
      try {
        errorData = responseData;
        if (errorData && typeof errorData === 'object') {
          message = errorData.error || errorData.message || 
                   (Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message) || 
                   message;
        }
      } catch {}
      
      console.error('❌ API Error:', {
        status: res.status,
        statusText: res.statusText,
        message,
        errorData,
      });
      
      console.groupEnd();
      
      const error = new Error(message);
      error.status = res.status;
      error.statusText = res.statusText;
      error.data = errorData;
      throw error;
    }
    
    console.log('✅ API Success');
    
    console.groupEnd();
    return responseData;
  } catch (error) {
    console.error('❌ API Request Failed:', error);
    
    console.groupEnd();
    throw error;
  }
} 