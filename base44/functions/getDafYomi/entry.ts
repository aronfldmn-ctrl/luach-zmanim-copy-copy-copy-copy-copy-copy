// Simple Daf Yomi calculation
// Daf Yomi cycle started on Rosh Hashanah 5714 (September 23, 1953)
// Each masechta and daf page is fixed by order

const masechtas = [
  { name: 'Brachot', nameHeb: 'ברכות', dafim: 64 },
  { name: 'Shabbat', nameHeb: 'שבת', dafim: 157 },
  { name: 'Eruvin', nameHeb: 'עירובין', dafim: 105 },
  { name: 'Pesachim', nameHeb: 'פסחים', dafim: 121 },
  { name: 'Rosh Hashanah', nameHeb: 'ראש השנה', dafim: 35 },
  { name: 'Yoma', nameHeb: 'יומא', dafim: 88 },
  { name: 'Sukkah', nameHeb: 'סוכה', dafim: 56 },
  { name: 'Beitzah', nameHeb: 'ביצה', dafim: 40 },
  { name: 'Taanit', nameHeb: 'תעניות', dafim: 31 },
  { name: 'Megillah', nameHeb: 'מגילה', dafim: 32 },
  { name: 'Moed Katan', nameHeb: 'מועד קטן', dafim: 29 },
  { name: 'Chagigah', nameHeb: 'חגיגה', dafim: 27 },
  { name: 'Yevamot', nameHeb: 'יבמות', dafim: 122 },
  { name: 'Ketubot', nameHeb: 'כתובות', dafim: 112 },
  { name: 'Nedarim', nameHeb: 'נדרים', dafim: 91 },
  { name: 'Nazir', nameHeb: 'נזיר', dafim: 66 },
  { name: 'Sotah', nameHeb: 'סוטה', dafim: 49 },
  { name: 'Gittin', nameHeb: 'גיטין', dafim: 90 },
  { name: 'Kiddushin', nameHeb: 'קידושין', dafim: 82 },
  { name: 'Bava Kamma', nameHeb: 'בבא קמא', dafim: 119 },
  { name: 'Bava Metzia', nameHeb: 'בבא מציעא', dafim: 119 },
  { name: 'Bava Batra', nameHeb: 'בבא בתרא', dafim: 176 },
  { name: 'Sanhedrin', nameHeb: 'סנהדרין', dafim: 113 },
  { name: 'Makkot', nameHeb: 'מכות', dafim: 24 },
  { name: 'Shevuot', nameHeb: 'שבועות', dafim: 49 },
  { name: 'Avodah Zarah', nameHeb: 'עבודה זרה', dafim: 76 },
  { name: 'Horayot', nameHeb: 'הוריות', dafim: 14 },
  { name: 'Zevaim', nameHeb: 'זבחים', dafim: 120 },
  { name: 'Menachot', nameHeb: 'מנחות', dafim: 110 },
  { name: 'Chullin', nameHeb: 'חולין', dafim: 142 },
  { name: 'Bekhorot', nameHeb: 'בכורות', dafim: 61 },
  { name: 'Arachin', nameHeb: 'ערכין', dafim: 34 },
  { name: 'Temurah', nameHeb: 'תמורה', dafim: 34 },
  { name: 'Keritot', nameHeb: 'כריתות', dafim: 28 },
  { name: 'Meilah', nameHeb: 'מעילה', dafim: 22 },
  { name: 'Kinnim', nameHeb: 'קינים', dafim: 4 },
  { name: 'Tamid', nameHeb: 'תמיד', dafim: 9 },
  { name: 'Midot', nameHeb: 'מדות', dafim: 3 },
  { name: 'Nida', nameHeb: 'נידה', dafim: 73 }
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
        masechetaHeb: masechtas[i].nameHeb,
        daf: daf,
        amud: amud,
        title: `${masechtas[i].name} ${daf}${amud}`,
        titleHeb: `${masechtas[i].nameHeb} ${daf}${amud}`
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
          masechetaHeb: dafYomi.masechetaHeb,
          daf: String(dafYomi.daf),
          amud: dafYomi.amud,
          title: dafYomi.title,
          titleHeb: dafYomi.titleHeb
        }
      });
    }
    
    return Response.json({ data: null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});