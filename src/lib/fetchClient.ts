import { getAuth0AccessToken } from '@/actions/getAuth0AccessToken';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// path can be absolute or relative
// token can be passed in options or from localStorage or fetched out from session
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string },
  payload?: any,
  _?: string
) {
  const token = options?.token || (await getAuth0AccessToken());
  const path_ = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  // console.log(`Bearer ${token}`);
  const contentTypeHeader =
    options?.headers &&
    typeof options.headers === 'object' &&
    !(options.headers instanceof Headers) &&
    !Array.isArray(options.headers)
      ? (options.headers as Record<string, string>)['Content-Type']
      : undefined;

  const headers = {
    ...(payload
      ? { 'Content-Type': contentTypeHeader || 'application/json' }
      : {}),
    Authorization: `Bearer ${token}`,
    ...(options?.headers || {}),
  };

  const res = await fetch(path_, {
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    ...options,
  });

  if (!res.ok) {
    try {
      const error = await res.json();
      return { error, status: res.status, headers: res.headers };
    } catch {
      const error = await res.text();
      return { error, status: res.status, headers: res.headers };
    }
  }

  try {
    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else if (
      contentType.startsWith('image/') ||
      contentType === 'application/octet-stream' ||
      contentType.includes('application/pdf')
    ) {
      data = await res.blob();
    } else {
      // Default to text for other content types
      data = await res.text();
    }

    return { data: data as T, status: res.status, headers: res.headers };
  } catch (error) {
    throw error;
  }
}
