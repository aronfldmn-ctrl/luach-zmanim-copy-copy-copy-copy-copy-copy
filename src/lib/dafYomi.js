import KosherZmanim from 'kosher-zmanim';

export async function fetchDafYomi(date) {
  try {
    const daf = new KosherZmanim.Dafyomi(date);
    const dafName = daf.getName();
    const mesechta = daf.getMasechta();
    
    return {
      ref: `${mesechta} ${dafName}`,
      display: `${mesechta} ${dafName}`,
      mesechta,
      dafName
    };
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}