const BASE_URL = () => {
  const val = (process.env.BASE_URL || '').replace(/\/*$/, '');
  if (!val) throw new Error('BASE_URL must be set for API calls');
  return val;
};

const API_BASE_URL = () => {
  const val = (process.env.API_BASE_URL || '').replace(/\/*$/, '');
  if (!val) throw new Error('API_BASE_URL must be set for API calls');
  return val;
};

const API_EVENT_ID = () => {
  const val = process.env.API_EVENT_ID;
  if (!val) throw new Error('API_EVENT_ID must be set for API calls');
  return val;
};

const fetchEndpoint = async (
  endpoint,
  token,
  options = {},
  ok = true,
  json = true,
) => {
  const response = await fetch(`${API_BASE_URL()}${endpoint}`, {
    ...options,
    ...(token
      ? {
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        }
      : {}),
  });
  if (ok && !response.ok) {
    const err = new Error(
      `API error: ${options.method || 'GET'} ${endpoint}: ${response.status} ${
        response.statusText
      }`,
    );
    err.status = response.status;
    err.response = response;
    throw err;
  }
  return json ? response.json() : response;
};

export const oauth = (provider) =>
  `${API_BASE_URL()}/users/oauth/${encodeURIComponent(
    provider,
  )}?success_redirect=${encodeURIComponent(
    `${BASE_URL()}/auth`,
  )}&error_redirect=${encodeURIComponent(`${BASE_URL()}/auth`)}`;

export const fetchUser = async (userId, token) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}`, token);

export const updateUser = async (userId, token, data) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const fetchUserEmails = async (userId, token) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}/emails`, token);

export const fetchUserAvatars = async (userId, token) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}/avatars`, token);

export const fetchUserOAuth = async (userId, token) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}/oauth`, token);

export const createUserOAuth = async (userId, token, provider) =>
  fetchEndpoint(
    `/users/${encodeURIComponent(userId)}/oauth/${encodeURIComponent(
      provider,
    )}?success_redirect=${encodeURIComponent(
      `${BASE_URL()}/auth`,
    )}&error_redirect=${encodeURIComponent(`${BASE_URL()}/auth`)}`,
    token,
  );

export const removeUserOAuth = async (userId, token, provider) =>
  fetchEndpoint(
    `/users/${encodeURIComponent(userId)}/oauth/${encodeURIComponent(
      provider,
    )}`,
    token,
    { method: 'DELETE' },
    true,
    false,
  );

export const triggerUserIngest = async (userId, token) =>
  fetchEndpoint(`/users/${encodeURIComponent(userId)}/ingest`, token, {
    method: 'POST',
  });

export const fetchRegistration = async (userId, token) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(
      API_EVENT_ID(),
    )}/registrations/${encodeURIComponent(userId)}`,
    token,
  );

export const createRegistration = async (userId, token, data) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(
      API_EVENT_ID(),
    )}/registrations/${encodeURIComponent(userId)}`,
    token,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );

export const updateRegistration = async (userId, token, data) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(
      API_EVENT_ID(),
    )}/registrations/${encodeURIComponent(userId)}`,
    token,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );

export const fetchMetadata = async (token) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(API_EVENT_ID())}/metadata`,
    token,
  );

export const fetchPullRequests = async (userId, token, exclude = []) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(
      API_EVENT_ID(),
    )}/pull_requests/users/${encodeURIComponent(
      userId,
    )}?excludeState=${encodeURIComponent(exclude.join(','))}`,
    token,
  );

export const fetchGiftCodes = async (userId, token) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(
      API_EVENT_ID(),
    )}/gift_codes/users/${encodeURIComponent(userId)}`,
    token,
  );

export const createExcludedRepository = async (userId, token, data) =>
  fetchEndpoint(
    `/events/${encodeURIComponent(API_EVENT_ID())}/excluded_repositories`,
    token,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repos: data,
      }),
    },
  );
