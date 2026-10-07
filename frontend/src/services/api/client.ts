export type TokenGetter = () => Promise<string | null>;

export interface ApiRequestOptions {
  getToken: TokenGetter;
  signal: AbortSignal;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export class MissingSessionTokenError extends Error {
  constructor() {
    super('Clerk did not provide a session token for the protected request');
    this.name = 'MissingSessionTokenError';
  }
}

export async function fetchWithClerkAuth(
  getToken: TokenGetter,
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  init.signal?.throwIfAborted();
  const token = await getToken();
  init.signal?.throwIfAborted();
  if (!token) throw new MissingSessionTokenError();

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { credentials: 'include', ...init, headers });
}

// Paths stay relative so both the Vite proxy and production reverse proxy
// send requests (including the Moodle cookie) through the frontend origin.
export async function requestJson<T>(
  path: string,
  { getToken, signal }: ApiRequestOptions,
  parse: (value: unknown) => T,
): Promise<T> {
  const response = await fetchWithClerkAuth(getToken, path, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, `Request to ${path} failed (${response.status})`);
  }
  const value: unknown = await response.json();
  signal.throwIfAborted();
  return parse(value);
}
