// Simple Daf Yomi calculation
// Daf Yomi cycle started on Rosh Hashanah 5714 (September 23, 1953)
// Each masechta and daf page is fixed by order

const masechtas = [
  { name: 'Brachot', dafim: 64 },
  { name: 'Shabbat', dafim: 157 },
  { name: 'Eruvin', dafim: 105 },
  { name: 'Pesachim', dafim: 121 },
  { name: 'Rosh Hashanah', dafim: 35 },
  { name: 'Yoma', dafim: 88 },
  { name: 'Sukkah', dafim: 56 },
  { name: 'Beitzah', dafim: 40 },
  { name: 'Taanit', dafim: 31 },
  { name: 'Megillah', dafim: 32 },
  { name: 'Moed Katan', dafim: 29 },
  { name: 'Chagigah', dafim: 27 },
  { name: 'Yevamot', dafim: 122 },
  { name: 'Ketubot', dafim: 112 },
  { name: 'Nedarim', dafim: 91 },
  { name: 'Nazir', dafim: 66 },
  { name: 'Sotah', dafim: 49 },
  { name: 'Gittin', dafim: 90 },
  { name: 'Kiddushin', dafim: 82 },
  { name: 'Bava Kamma', dafim: 119 },
  { name: 'Bava Metzia', dafim: 119 },
  { name: 'Bava Batra', dafim: 176 },
  { name: 'Sanhedrin', dafim: 113 },
  { name: 'Makkot', dafim: 24 },
  { name: 'Shevuot', dafim: 49 },
  { name: 'Avodah Zarah', dafim: 76 },
  { name: 'Horayot', dafim: 14 },
  { name: 'Zevaim', dafim: 120 },
  { name: 'Menachot', dafim: 110 },
  { name: 'Chullin', dafim: 142 },
  { name: 'Bekhorot', dafim: 61 },
  { name: 'Arachin', dafim: 34 },
  { name: 'Temurah', dafim: 34 },
  { name: 'Keritot', dafim: 28 },
  { name: 'Meilah', dafim: 22 },
  { name: 'Kinnim', dafim: 4 },
  { name: 'Tamid', dafim: 9 },
  { name: 'Midot', dafim: 3 },
  { name: 'Nida', dafim: 73 }
];

function calculateDafYomi(date) {
  // Start date: September 23, 1953 (Hebrew date: 23 Elul 5713 / 1 Tishrei 5714)
  const startDate = new Date(1953, 8, 23);
  const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceStart < 0) {
    return null;
  }
  
  // Each "seder" (section) represents studying both sides (amud) of a page per day
  let cumulativeDays = 0;
  let totalDafim = masechtas.reduce((sum, m) => sum + m.dafim * 2, 0);
  let dayInCycle = daysSinceStart % totalDafim;
  
  for (let i = 0; i < masechtas.length; i++) {
    const dafCount = masechtas[i].dafim * 2;
    if (dayInCycle < dafCount) {
      const daf = Math.floor(dayInCycle / 2) + 1;
      const amud = dayInCycle % 2 === 0 ? 'a' : 'b';
      return {
        masechta: masechtas[i].name,
        daf: daf,
        amud: amud,
        title: `${masechtas[i].name} ${daf}${amud}`
      };
    }
    dayInCycle -= dafCount;
  }
  
  return null;
}

Deno.serve(async (req) => {
  try {
    const today = new Date();
    const dafYomi = calculateDafYomi(today);
    
    if (dafYomi) {
      return Response.json({
        data: {
          masechta: dafYomi.masechta,
          daf: String(dafYomi.daf),
          amud: dafYomi.amud,
          title: dafYomi.title
        }
      });
    }
    
    return Response.json({ data: null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});