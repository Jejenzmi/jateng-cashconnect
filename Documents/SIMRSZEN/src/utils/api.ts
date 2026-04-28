// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get token from localStorage
const getToken = (): string | null => {
  const sessionStr = localStorage.getItem('auth-session');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      return session.token || null;
    } catch (e) {
      console.error('Error parsing session from localStorage:', e);
      return null;
    }
  }
  return null;
};

// Generic API utility
export const apiRequest = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  // Get token and add to headers if it exists
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Handle unauthorized specifically
    if (response.status === 401) {
      // Clear invalid token if present
      if (token) {
        localStorage.removeItem('auth-session');
        localStorage.removeItem('auth-user');
      }
      throw new Error(`API request failed: Unauthorized`);
    }
    
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// GET request
function getApiImpl<T>(endpoint: string): Promise<T>;
function getApiImpl<T>(query: TemplateStringsArray, ...params: any[]): Promise<T>;
function getApiImpl<T>(endpointOrQuery: string | TemplateStringsArray, ...params: any[]): Promise<T> {
  if (typeof endpointOrQuery === 'string') {
    return apiRequest<T>(endpointOrQuery, { method: 'GET' });
  }
  // Tagged template literal - treat as SQL query (same as getApiUnsafe)
  let sqlQuery = endpointOrQuery[0];
  for (let i = 0; i < params.length; i++) {
    sqlQuery += params[i] + endpointOrQuery[i + 1];
  }
  const fetchResult = fetch(`${API_BASE_URL}/unsafe-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
    body: JSON.stringify({ query: sqlQuery.trim() }),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  });
  return fetchResult;
}
export const getApi = getApiImpl;

// Unsafe GET request for direct SQL queries
export const getApiUnsafe = async <T>(query: TemplateStringsArray, ...params: any[]): Promise<T> => {
  // Combine the template string with parameters to form the complete query
  let sqlQuery = query[0];
  for (let i = 0; i < params.length; i++) {
    sqlQuery += params[i] + query[i + 1];
  }
  
  // Send the SQL query as part of the request body
  const response = await fetch(`${API_BASE_URL}/unsafe-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken() || ''}`,
    },
    body: JSON.stringify({ query: sqlQuery.trim() }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Also attach the unsafe method to the getApi function for backward compatibility
(getApi as any).unsafe = getApiUnsafe;

// POST request
export const postApi = async <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const putApi = async <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const deleteApi = async <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};