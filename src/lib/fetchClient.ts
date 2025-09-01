import { getAuth0AccessToken } from '@/actions/getAuth0AccessToken';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// path can be absolute or relative
// token can be passed in options or from localStorage or fetched out from session
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
) {
  const token = options?.token || (await getAuth0AccessToken());

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
