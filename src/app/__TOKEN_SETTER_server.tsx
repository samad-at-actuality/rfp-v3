'use client';

import { useEffect } from 'react';

export function TOKEN_SETTER_server({
  getToken,
}: {
  getToken: () => Promise<string>;
}) {
  useEffect(() => {
    (async () => {
      localStorage.setItem(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_LABEL_FOR_LOCAL_STORAGE!,
        await getToken()
      );
    })();
  }, [getToken]);

  return null;
}
