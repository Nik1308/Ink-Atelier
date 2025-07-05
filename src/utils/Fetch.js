import { useEffect, useState } from "react";

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
    fetch(url, options)
      .then((res) => {
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
export async function fetchApi(url, options) {
  let fetchOptions = { ...options };
  // If body is FormData, remove Content-Type header so browser sets it
  if (fetchOptions.body instanceof FormData && fetchOptions.headers) {
    const headers = { ...fetchOptions.headers };
    if (headers["Content-Type"]) {
      delete headers["Content-Type"];
    }
    fetchOptions.headers = headers;
  }
  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    let message = `Error: ${res.status}`;
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
} 