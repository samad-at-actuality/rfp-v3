import { getAuth0AccessToken } from '@/actions/getAuth0AccessToken';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// path can be absolute or relative
// token can be passed in options or from localStorage or fetched out from session
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string },
  payload?: any
) {
  const token = options?.token || (await getAuth0AccessToken());

  const path_ = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const res = await fetch(path_, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });
  let response: T | any;

  try {
    // Try to parse error response as JSON
    response = await res.json();
  } catch {
    // If not JSON, get text instead
    response = await res.text();
  }

  if (!res.ok) {
    return { error: response, status: res.status };
  }

  return { data: response as T, status: res.status };
}
