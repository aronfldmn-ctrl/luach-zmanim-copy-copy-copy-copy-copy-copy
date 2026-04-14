import { Dafyomi } from 'kosher-zmanim/dist/kosher-zmanim.js';

export async function fetchDafYomi(date) {
  try {
    const daf = new Dafyomi(date);
    const mesechta = daf.getMasechta();
    const dafPage = daf.getDaf();
    
    return {
      ref: `${mesechta} ${dafPage}`,
      display: `${mesechta} ${dafPage}`,
      mesechta,
      dafPage
    };
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}