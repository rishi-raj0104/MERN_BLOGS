import { getEnv } from "./getEnv";

let csrfToken = null;

// Get CSRF token from cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// Fetch CSRF token from server
export const fetchCSRFToken = async () => {
  try {
    const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/csrf-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch CSRF token");
    }

    const data = await response.json();
    csrfToken = data.csrfToken;
    
    // Also try to get from cookie as fallback
    const cookieToken = getCookie("csrf_token");
    if (cookieToken) {
      csrfToken = cookieToken;
    }
    
    // Also check response header
    const headerToken = response.headers.get("X-CSRF-Token");
    if (headerToken) {
      csrfToken = headerToken;
    }

    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    // Try to get from cookie as last resort
    const cookieToken = getCookie("csrf_token");
    if (cookieToken) {
      csrfToken = cookieToken;
      return csrfToken;
    }
    return null;
  }
};

// Get current CSRF token
export const getCSRFToken = () => {
  // Try cookie first
  const cookieToken = getCookie("csrf_token");
  if (cookieToken) {
    csrfToken = cookieToken;
    return csrfToken;
  }
  
  // Return stored token
  return csrfToken;
};

// Set CSRF token (called after login)
export const setCSRFToken = (token) => {
  csrfToken = token;
};

// Initialize CSRF token on app load
export const initCSRF = async () => {
  await fetchCSRFToken();
};

// Add CSRF token to fetch request
export const fetchWithCSRF = async (url, options = {}) => {
  // Get or fetch CSRF token
  let token = getCSRFToken();
  
  if (!token) {
    token = await fetchCSRFToken();
  }

  // Add CSRF token to headers
  const headers = {
    ...options.headers,
    "X-CSRF-Token": token || "",
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};
