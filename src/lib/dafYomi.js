import { base44 } from '@/api/base44Client';
import { getFromCache, setInCache } from './cacheUtils';

export async function fetchDafYomi(date) {
  try {
    // Try cache first
    const cached = getFromCache('daf_yomi');
    if (cached) return cached;
    
    const res = await base44.functions.invoke('getDafYomi', {});
    const data = res.data?.data || null;
    if (data) {
      setInCache('daf_yomi', data); // Cache for 24 hours
    }
    return data;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    // Fallback to cache on error
    return getFromCache('daf_yomi');
  }
}