export async function fetchDafYomi(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const res = await fetch(`https://www.sefaria.org/api/v2/daf-yomi/${dateStr}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    
    if (data && data.daf_yomi && data.daf_yomi[0]) {
      const ref = data.daf_yomi[0].name || data.daf_yomi[0];
      return {
        ref,
        display: (typeof ref === 'string' ? ref : ref.name).replace(/\s+/g, '\u00A0'),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}