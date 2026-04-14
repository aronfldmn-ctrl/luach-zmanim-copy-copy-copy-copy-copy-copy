import { base44 } from '@/api/base44Client';

export async function fetchDafYomi(date) {
  try {
    const res = await base44.functions.invoke('getDafYomi', {});
    return res.data?.data || null;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}