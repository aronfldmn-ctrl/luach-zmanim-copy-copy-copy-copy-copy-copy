export async function fetchDafYomi(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const res = await fetch(`https://www.sefaria.org/api/daf-yomi/${dateStr}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.ref) return null;

    return {
      ref: data.ref,
      display: data.ref.replace(/\s+/g, '\u00A0'), // non-breaking spaces for readability
    };
  } catch {
    return null;
  }
}