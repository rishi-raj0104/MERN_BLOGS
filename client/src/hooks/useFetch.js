import { useEffect, useState } from "react";
import { getCSRFToken } from "@/helpers/csrf";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Add CSRF token for state-changing methods (not needed for GET)
        const method = options.method?.toUpperCase() || "GET";
        const needsCSRF = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

        const headers = {
          ...options.headers,
        };

        if (needsCSRF) {
          const csrfToken = getCSRFToken();
          if (csrfToken) {
            headers["X-CSRF-Token"] = csrfToken;
          }
        }

        const response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}, ${response.status}`);
        }

        setData(responseData);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, ...dependencies]);

  return { data, loading, error };
};
