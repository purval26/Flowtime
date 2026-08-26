'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, logEvent } from '../lib/firebase';

function AnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (analytics) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      logEvent(analytics, 'page_view', {
        page_path: url,
        page_title: document.title || pathname,
        page_location: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function FirebaseAnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
