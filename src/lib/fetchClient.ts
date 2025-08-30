import { auth0 } from './auth0';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// path can be absolute or relative
// token can be passed in options or from localStorage or fetched out from session
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
) {
  let token: string | null | undefined = options?.token;
  if (!options?.token) {
    if (typeof window === 'undefined') {
      try {
        const { token: accessToken } = await auth0.getAccessToken();
        token = accessToken;
      } catch {}
    } else {
      const storedToken = localStorage.getItem(
        process.env.NEXT_PUBLIC_AUTH0_ACCESS_TOKEN!
      );

      if (storedToken) {
        token = storedToken;
      }
    }
  }

  const path_ = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const res = await fetch(path_, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    // throw new Error(`Fetch error: ${res.status}`);
    return null;
  }

  return res.json() as Promise<T>;
}
