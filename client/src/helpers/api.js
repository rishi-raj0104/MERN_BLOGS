import { getCSRFToken, fetchCSRFToken } from "./csrf";

// Enhanced fetch with automatic CSRF token handling
export const apiFetch = async (url, options = {}) => {
  const method = options.method?.toUpperCase() || "GET";

  // Get CSRF token if needed
  let csrfToken = null;
  csrfToken = getCSRFToken();

  // If no token, try to fetch it
  if (!csrfToken) {
    csrfToken = await fetchCSRFToken();
  }

  // Build headers - don't set Content-Type for FormData (browser sets it with boundary)
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  // Add CSRF token to headers for state-changing requests
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // If CSRF token is invalid/missing, try to refresh and retry once
  if (response.status === 403) {
    const data = await response
      .clone()
      .json()
      .catch(() => ({}));
    if (data.message?.includes("CSRF")) {
      // Refresh CSRF token and retry
      const newToken = await fetchCSRFToken();
      if (newToken) {
        headers["X-CSRF-Token"] = newToken;
        return fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    }
  }

  return response;
};

// Helper for API calls with automatic error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await apiFetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return { success: true, data, response };
  } catch (error) {
    return { success: false, error: error.message, response: null };
  }
};
