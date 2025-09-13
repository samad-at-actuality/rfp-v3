'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useUnsavedChangesWarning(isDirty: boolean) {
  const router = useRouter();

  // Handle tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; // required for Chrome
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle <Link> clicks
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (
        anchor &&
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.target // ignore new tab links
      ) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Do you really want to leave?'
        );
        if (!confirmLeave) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener('click', handleClick, true); // capture phase
    return () => document.removeEventListener('click', handleClick, true);
  }, [isDirty]);

  // Patch router.push & router.replace
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = ((...args: Parameters<typeof router.push>) => {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you really want to leave?'
      );
      if (confirmLeave) {
        return originalPush.apply(router, args);
      }
      return Promise.resolve(false) as unknown as void;
    }) as typeof router.push;

    router.replace = ((...args: Parameters<typeof router.replace>) => {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you really want to leave?'
      );
      if (confirmLeave) {
        return originalReplace.apply(router, args);
      }
      return Promise.resolve(false) as unknown as void;
    }) as typeof router.replace;

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [isDirty, router]);
}
