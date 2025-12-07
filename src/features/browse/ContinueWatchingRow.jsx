'use client';

import React, { useState, useEffect } from 'react';
import ContentRow from './ContentRow';
import { useHistoryStore } from '@/hooks/useHistoryStore';

const ContinueWatchingRow = () => {
  const { history } = useHistoryStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || history.length === 0) {
    return null;
  }

  // Pass history as localData to ContentRow
  return <ContentRow title="Continue Watching" localData={history} />;
};

export default ContinueWatchingRow;