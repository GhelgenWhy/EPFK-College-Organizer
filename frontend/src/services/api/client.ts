type TokenGetter = () => Promise<string | null>;

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
  const token = await getToken();
  if (!token) throw new MissingSessionTokenError();

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
