const toHebrewNumerals = (num) => {
  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundreds = ['', 'ק', 'ר', 'ש', 'ת'];
  
  const numStr = String(num);
  let result = '';
  
  for (let i = 0; i < numStr.length; i++) {
    const digit = parseInt(numStr[i]);
    const place = numStr.length - i - 1;
    
    if (place === 2) result += hundreds[digit];
    else if (place === 1) result += tens[digit];
    else if (place === 0) result += ones[digit];
  }
  
  return result;
};

Deno.serve(async (req) => {
  try {
    const hebNames = {
      'Brachot': 'ברכות',
      'Shabbat': 'שבת',
      'Eruvin': 'עירובין',
      'Pesachim': 'פסחים',
      'Rosh Hashanah': 'ראש השנה',
      'Yoma': 'יומא',
      'Sukkah': 'סוכה',
      'Beitzah': 'ביצה',
      'Taanit': 'תעניות',
      'Megillah': 'מגילה',
      'Moed Katan': 'מועד קטן',
      'Chagigah': 'חגיגה',
      'Yevamot': 'יבמות',
      'Ketubot': 'כתובות',
      'Nedarim': 'נדרים',
      'Nazir': 'נזיר',
      'Sotah': 'סוטה',
      'Gittin': 'גיטין',
      'Kiddushin': 'קידושין',
      'Bava Kamma': 'בבא קמא',
      'Bava Metzia': 'בבא מציעא',
      'Bava Batra': 'בבא בתרא',
      'Sanhedrin': 'סנהדרין',
      'Makkot': 'מכות',
      'Shevuot': 'שבועות',
      'Avodah Zarah': 'עבודה זרה',
      'Horayot': 'הוריות',
      'Zevaim': 'זבחים',
      'Menachot': 'מנחות',
      'Chullin': 'חולין',
      'Bekhorot': 'בכורות',
      'Arachin': 'ערכין',
      'Temurah': 'תמורה',
      'Keritot': 'כריתות',
      'Meilah': 'מעילה',
      'Kinnim': 'קינים',
      'Tamid': 'תמיד',
      'Midot': 'מדות',
      'Nida': 'נידה'
    };

    // Get user's local date in America/New_York timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    
    const res = await fetch(`https://www.sefaria.org/api/calendars?year=${year}&month=${month}&day=${day}&timezone=America/New_York&diaspora=1`);
    const json = await res.json();
    
    if (json.calendar_items) {
      // Find the Daf Yomi item
      const dafYomiItem = json.calendar_items.find(item => 
        item.title?.en === 'Daf Yomi'
      );
      
      if (dafYomiItem && dafYomiItem.displayValue) {
        const displayEn = dafYomiItem.displayValue.en;
        
        // Parse "Menachot 93" format - daf number may include 'a' or 'b' at the end
        const match = displayEn.match(/^(.*?)\s+(\d+)([ab]?)$/);
        if (match) {
          const [, masechta, daf, amud] = match;
          const masechetaHeb = hebNames[masechta] || masechta;
          
          return Response.json({
            data: {
              masechta: masechta,
              masechetaHeb: masechetaHeb,
              daf: daf,
              amud: amud || 'a', // Default to 'a' if not specified
              title: `${masechta} ${daf}`,
              titleHeb: `${masechetaHeb} ${toHebrewNumerals(parseInt(daf))}`
            }
          });
        }
      }
    }
    
    return Response.json({ data: null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});