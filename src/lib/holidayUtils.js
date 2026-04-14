// Holiday categorization and descriptions
export const HOLIDAY_CATEGORIES = {
  YOM_TOV: 'yom_tov',           // Major holidays
  FAST: 'fast',                 // Fasting days
  MINOR: 'minor',               // Minor holidays/commemorations
};

export const HOLIDAY_NAMES = {
  'Erev Pesach': { en: 'Erev Pesach', heb: 'ערב פסח' },
  'Pesach': { en: 'Pesach', heb: 'פסח' },
  'Pesach (8th day)': { en: 'Pesach (8th day)', heb: 'פסח (יום ח׳)' },
  'Chol HaMoed Pesach': { en: 'Chol HaMoed Pesach', heb: 'חול המועד פסח' },
   'Chol HaMoed Sukkot': { en: 'Chol HaMoed Sukkot', heb: 'חול המועד סוכות' },
   'Erev Shavuot': { en: 'Erev Shavuot', heb: 'ערב שבועות' },
  'Shavuot': { en: 'Shavuot', heb: 'שבועות' },

  'Erev Rosh Hashanah': { en: 'Erev Rosh Hashanah', heb: 'ערב ראש השנה' },
  'Rosh Hashanah': { en: 'Rosh Hashanah', heb: 'ראש השנה' },
  'Erev Yom Kippur': { en: 'Erev Yom Kippur', heb: 'ערב יום הכיפורים' },

  'Yom Kippur': { en: 'Yom Kippur', heb: 'יום הכיפורים' },

  'Erev Sukkot': { en: 'Erev Sukkot', heb: 'ערב סוכות' },
  'Sukkot': { en: 'Sukkot', heb: 'סוכות' },

  'Shemini Atzeret': { en: 'Shemini Atzeret', heb: 'שמיני עצרת' },
  'Simchat Torah': { en: 'Simchat Torah', heb: 'שמחת תורה' },
  'Hanukkah': { en: 'Hanukkah', heb: 'חנוכה' },
  'Chanukah': { en: 'Chanukah', heb: 'חנוכה' },
  'Tu B\'Shevat': { en: 'Tu B\'Shevat', heb: 'ט״ו בשבט' },
  'Purim': { en: 'Purim', heb: 'פורים' },
  'Shushan Purim': { en: 'Shushan Purim', heb: 'פורים שושן' },
  'Erev Purim': { en: 'Erev Purim', heb: 'ערב פורים' },
  'Ta\'anit Esther': { en: 'Ta\'anit Esther', heb: 'תעניית אסתר' },
  'Tisha B\'Av': { en: 'Tisha B\'Av', heb: 'תשעה באב' },
  'Fast of Gedaliah': { en: 'Fast of Gedaliah', heb: 'צום גדליה' },
  'Tzom Gedaliah': { en: 'Tzom Gedaliah', heb: 'צום גדליה' },
  'Asara B\'Tevet': { en: 'Asara B\'Tevet', heb: 'עשרה בטבת' },
  '17 of Tammuz': { en: '17 of Tammuz', heb: 'י״ז בתמוז' },
  '10 of Tevet': { en: '10 of Tevet', heb: 'עשרה בטבת' },
  'Lag B\'Omer': { en: 'Lag B\'Omer', heb: 'ל״ג בעומר' },
  'Tu B\'Av': { en: 'Tu B\'Av', heb: 'ט״ו באב' },
  'Rosh Chodesh': { en: 'Rosh Chodesh', heb: 'ראש חודש' },
  'Sefirat HaOmer': { en: 'Sefirat HaOmer', heb: 'ספירת העומר' },
};

export const HOLIDAY_DESCRIPTIONS = {
  // Passover
   'Erev Pesach': 'Erev Pesach',
   'Pesach': 'Pesach',

   // Shavuot
  'Erev Shavuot': 'Erev Shavuot',
  'Shavuot': 'Shavuot',
  
  // Rosh Hashanah
  'Erev Rosh Hashanah': 'Erev Rosh Hashanah',
  'Rosh Hashana': 'Rosh Hashana',
  'Rosh Hashanah': 'Rosh Hashanah',
  
  // Yom Kippur
  'Erev Yom Kippur': 'Erev Yom Kippur',
  'Yom Kippur': 'Yom Kippur',
  
  // Sukkot
  'Erev Sukkot': 'Erev Sukkot',
  'Sukkot': 'Sukkot',
  'Lulav & Etrog': 'Lulav & Etrog',
  'Shemini Atzeret': 'Shemini Atzeret',
  'Simchat Torah': 'Simchat Torah',
  
  // Hanukkah
  'Hanukkah': 'Hanukkah',
  
  // Tu B\'Shevat
  'Tu B\'Shevat': 'Tu B\'Shevat',
  
  // Purim
  'Purim': 'Purim',
  'Shushan Purim': 'Shushan Purim',
  'Erev Purim': 'Erev Purim',
  
  // Fasts
  'Tisha B\'Av': 'Tisha B\'Av',
  'Fast of Gedaliah': 'Fast of Gedaliah',
  'Yom HaShoah': 'Yom HaShoah',
  '17 of Tammuz': '17 of Tammuz',
  '10 of Tevet': '10 of Tevet',
  
  // Other celebrations
  'Lag B\'Omer': 'Lag B\'Omer',
  
  // Sefirat HaOmer (dynamically named with day count)
  'Sefirat HaOmer': 'Sefirat HaOmer',
  
  // Other
  'Rosh Chodesh': 'Rosh Chodesh',
};

export const HOLIDAY_CATEGORIES_MAP = {
  // Yom Tov (major holidays)
  'Erev Pesach': HOLIDAY_CATEGORIES.YOM_TOV,
  'Pesach': HOLIDAY_CATEGORIES.YOM_TOV,
  'Chol HaMoed Pesach': HOLIDAY_CATEGORIES.YOM_TOV,
  'Erev Shavuot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Shavuot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Erev Rosh Hashanah': HOLIDAY_CATEGORIES.YOM_TOV,
  'Rosh Hashana': HOLIDAY_CATEGORIES.YOM_TOV,
  'Rosh Hashanah': HOLIDAY_CATEGORIES.YOM_TOV,
  'Erev Yom Kippur': HOLIDAY_CATEGORIES.YOM_TOV,
  'Yom Kippur': HOLIDAY_CATEGORIES.YOM_TOV,
  'Erev Sukkot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Sukkot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Chol HaMoed Sukkot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Shemini Atzeret': HOLIDAY_CATEGORIES.YOM_TOV,
  'Simchat Torah': HOLIDAY_CATEGORIES.YOM_TOV,
  
  // Minor
  'Erev Purim': HOLIDAY_CATEGORIES.MINOR,
  
  // Fasts
  'Tisha B\'Av': HOLIDAY_CATEGORIES.FAST,
  'Fast of Gedaliah': HOLIDAY_CATEGORIES.FAST,
  'Ta\'anit Esther': HOLIDAY_CATEGORIES.FAST,
  '17 of Tammuz': HOLIDAY_CATEGORIES.FAST,
  '10 of Tevet': HOLIDAY_CATEGORIES.FAST,
  
  // Minor
  'Hanukkah': HOLIDAY_CATEGORIES.MINOR,
  'Tu B\'Shevat': HOLIDAY_CATEGORIES.MINOR,
  'Purim': HOLIDAY_CATEGORIES.MINOR,
  'Shushan Purim': HOLIDAY_CATEGORIES.MINOR,
  'Lag B\'Omer': HOLIDAY_CATEGORIES.MINOR,
  'Rosh Chodesh': HOLIDAY_CATEGORIES.MINOR,
  'Lulav & Etrog': HOLIDAY_CATEGORIES.MINOR,
};

// Handle dynamic Sefirat HaOmer day names
export function getHolidayCategoryDynamic(holidayName) {
  if (holidayName && holidayName.startsWith('Sefirat HaOmer')) {
    return HOLIDAY_CATEGORIES.MINOR;
  }
  return getHolidayCategory(holidayName);
}

export function getHolidayColorDynamic(holidayName) {
  const category = getHolidayCategoryDynamic(holidayName);
  return HOLIDAY_COLORS[category] || HOLIDAY_COLORS[HOLIDAY_CATEGORIES.MINOR];
}

export function getHolidayCategory(holidayName) {
  return HOLIDAY_CATEGORIES_MAP[holidayName] || HOLIDAY_CATEGORIES.MINOR;
}

export function getHolidayDescription(holidayName) {
  return HOLIDAY_DESCRIPTIONS[holidayName] || holidayName;
}

export function getHolidayNameLocalized(holidayName, hebrewMode) {
  // Handle dynamic Sefirat HaOmer names (e.g., "Sefirat HaOmer - Day 5")
  if (holidayName && holidayName.startsWith('Sefirat HaOmer - Day')) {
    const day = holidayName.match(/Day (\d+)/)?.[1];
    if (day && hebrewMode) {
      return `ספירת העומר - יום ${day}`;
    }
    return holidayName;
  }
  
  const names = HOLIDAY_NAMES[holidayName];
  if (!names) return holidayName;
  return hebrewMode ? names.heb : names.en;
}

export const HOLIDAY_COLORS = {
  [HOLIDAY_CATEGORIES.YOM_TOV]: { bg: 'bg-red-100 dark:bg-red-950', border: 'border-red-300 dark:border-red-700', text: 'text-red-700 dark:text-red-300' },
  [HOLIDAY_CATEGORIES.FAST]: { bg: 'bg-slate-200 dark:bg-slate-800', border: 'border-slate-400 dark:border-slate-600', text: 'text-slate-700 dark:text-slate-300' },
  [HOLIDAY_CATEGORIES.MINOR]: { bg: 'bg-blue-100 dark:bg-blue-950', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300' },
};

export function getHolidayColor(holidayName) {
  const category = getHolidayCategory(holidayName);
  return HOLIDAY_COLORS[category] || HOLIDAY_COLORS[HOLIDAY_CATEGORIES.MINOR];
}