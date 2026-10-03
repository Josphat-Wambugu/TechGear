import { useContext } from 'react';
import { StoreDataContext } from '@/context/StoreDataContext';

export function useStoreData() {
  const ctx = useContext(StoreDataContext);
  if (!ctx) throw new Error('useStoreData must be used within a StoreDataProvider');
  return ctx;
}
