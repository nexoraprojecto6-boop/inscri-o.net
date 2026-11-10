'use client';

import { useEffect, useState } from 'react';
import { getParticipantId, getSessionId } from '@/lib/utils';

/**
 * Botão/ligação que passa por /api/tracking (regista o clique no servidor)
 * e só depois é redirecionado para o link de afiliado Deriv.
 */
export default function DerivLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [href, setHref] = useState('/api/tracking');

  useEffect(() => {
    const params = new URLSearchParams({ sid: getSessionId() });
    const pid = getParticipantId();
    if (pid) params.set('pid', pid);
    setHref(`/api/tracking?${params.toString()}`);
  }, []);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer sponsored" className={className}>
      {children}
    </a>
  );
}
