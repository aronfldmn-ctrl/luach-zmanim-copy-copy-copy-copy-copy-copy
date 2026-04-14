export async function fetchDafYomi(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const res = await fetch(`https://www.sefaria.org/api/daf-yomi/${dateStr}`);
    const data = await res.json();
    
    // Sefaria returns ref in the response
    if (data && data.ref) {
      return {
        ref: data.ref,
        display: data.ref.replace(/\s+/g, '\u00A0'),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}