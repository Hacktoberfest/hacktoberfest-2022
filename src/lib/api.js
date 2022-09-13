import fetch from 'cross-fetch';

const BASE_URL = (process.env.BASE_URL || '').replace(/\/*$/, '');
if (!BASE_URL) throw new Error('BASE_URL must be set for API calls');

const API_BASE_URL = (process.env.API_BASE_URL || '').replace(/\/*$/, '');
if (!API_BASE_URL) throw new Error('API_BASE_URL must be set for API calls');

const API_EVENT_ID = process.env.API_EVENT_ID;
if (!API_EVENT_ID) throw new Error('API_EVENT_ID must be set for API calls');

const fetchEndpoint = async (endpoint, token, options = {}, ok = true, json = true) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    ...(token ? { headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } } : {}),
  });
  if (ok && !response.ok) {
    const err = new Error(`API error: ${options.method || 'GET'} ${endpoint}: ${response.status} ${response.statusText}`);
    err.status = response.status;
    throw err;
  }
  return json ? response.json() : response;
};

export const oauth = provider => `${API_BASE_URL}/users/oauth/${encodeURIComponent(provider)}?success_redirect=${encodeURIComponent(`${BASE_URL}/auth`)}&error_redirect=${encodeURIComponent(`${BASE_URL}/auth`)}`;

export const fetchUser = async (id, token) => fetchEndpoint(`/users/${encodeURIComponent(id)}`, token);

export const fetchUserEmails = async (id, token) => fetchEndpoint(`/users/${encodeURIComponent(id)}/emails`, token);

export const fetchRegistration = async (id, token) => fetchEndpoint(`/events/${encodeURIComponent(API_EVENT_ID)}/registrations/${encodeURIComponent(id)}`, token);

export const fetchMetadata = async (token) => fetchEndpoint(`/events/${encodeURIComponent(API_EVENT_ID)}/metadata`, token);
