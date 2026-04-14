export async function fetchDafYomi(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const res = await fetch(`https://www.shas.org/api/dafyomi?date=${dateStr}`);
    if (!res.ok) return null;

    const data = await res.json();
    
    if (data && data.masechta && data.daf) {
      return {
        ref: `${data.masechta} ${data.daf}`,
        display: `${data.masechta} ${data.daf}`,
        masechta: data.masechta,
        dafPage: data.daf
      };
    }
    
    return null;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}