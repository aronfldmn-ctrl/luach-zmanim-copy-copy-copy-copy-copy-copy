import { YomiCalculator } from 'kosher-zmanim/dist/kosher-zmanim.js';

export async function fetchDafYomi(date) {
  try {
    const dayOfDaf = YomiCalculator.getDayOfDaf(date);
    const masechta = YomiCalculator.getMasechta(dayOfDaf);
    const dafPage = YomiCalculator.getDaf(dayOfDaf);
    
    return {
      ref: `${masechta} ${dafPage}`,
      display: `${masechta} ${dafPage}`,
      masechta,
      dafPage,
      dayOfDaf
    };
  } catch (error) {
    console.error('Daf Yomi fetch error:', error);
    return null;
  }
}