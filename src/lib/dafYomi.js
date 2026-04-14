export async function fetchDafYomi(date) {
  try {
    const res = await fetch('https://www.shas.org/api/v1/daf-yomi');
    if (!res.ok) return null;

    const data = await res.json();
    
    if (data && data.current_daf && data.current_daf.masechta && data.current_daf.daf) {
      return {
        ref: `${data.current_daf.masechta} ${data.current_daf.daf}`,
        display: `${data.current_daf.masechta} ${data.current_daf.daf}`,
        masechta: data.current_daf.masechta,
        dafPage: data.current_daf.daf,
        cycle: data.cycle
      };
    }
    
    return null;
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}