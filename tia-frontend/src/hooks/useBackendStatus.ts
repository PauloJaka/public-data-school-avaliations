'use client';

import { useEffect, useState } from 'react';

export type BackendStatus = 'checking' | 'online' | 'offline';

export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(r => setStatus(r.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
  }, []);

  return status;
}
