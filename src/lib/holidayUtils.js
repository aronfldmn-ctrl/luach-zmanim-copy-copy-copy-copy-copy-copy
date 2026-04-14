// Holiday categorization and descriptions
export const HOLIDAY_CATEGORIES = {
  YOM_TOV: 'yom_tov',           // Major holidays
  INTERMEDIATE: 'intermediate',  // Chol HaMoed
  FAST: 'fast',                 // Fasting days
  MINOR: 'minor',               // Minor holidays/commemorations
  OBSERVANCE: 'observance',     // Other observances
};

export const HOLIDAY_NAMES = {
  'Pesach': { en: 'Pesach', heb: 'פסח' },
  'Pesach (8th day)': { en: 'Pesach (8th day)', heb: 'פסח (יום ח׳)' },
  'Erev Pesach': { en: 'Erev Pesach', heb: 'ערב פסח' },
  'Chol HaMoed Pesach': { en: 'Chol HaMoed Pesach', heb: 'חול המועד פסח' },
  'Shavuot': { en: 'Shavuot', heb: 'שבועות' },
  'Erev Shavuot': { en: 'Erev Shavuot', heb: 'ערב שבועות' },
  'Rosh Hashanah': { en: 'Rosh Hashanah', heb: 'ראש השנה' },
  'Erev Rosh Hashana': { en: 'Erev Rosh Hashanah', heb: 'ערב ראש השנה' },
  'Yom Kippur': { en: 'Yom Kippur', heb: 'יום הכיפורים' },
  'Erev Yom Kippur': { en: 'Erev Yom Kippur', heb: 'ערב יום הכיפורים' },
  'Sukkot': { en: 'Sukkot', heb: 'סוכות' },
  'Chol HaMoed Sukkot': { en: 'Chol HaMoed Sukkot', heb: 'חול המועד סוכות' },
  'Erev Sukkot': { en: 'Erev Sukkot', heb: 'ערב סוכות' },
  'Shemini Atzeret': { en: 'Shemini Atzeret', heb: 'שמיני עצרת' },
  'Simchat Torah': { en: 'Simchat Torah', heb: 'שמחת תורה' },
  'Hanukkah': { en: 'Hanukkah', heb: 'חנוכה' },
  'Tu B\'Shevat': { en: 'Tu B\'Shevat', heb: 'ט״ו בשבט' },
  'Purim': { en: 'Purim', heb: 'פורים' },
  'Shushan Purim': { en: 'Shushan Purim', heb: 'פורים שושן' },
  'Erev Purim': { en: 'Erev Purim', heb: 'ערב פורים' },
  'Ta\'anit Esther': { en: 'Ta\'anit Esther', heb: 'תעניית אסתר' },
  'Tisha B\'Av': { en: 'Tisha B\'Av', heb: 'תשעה באב' },
  'Fast of Gedaliah': { en: 'Fast of Gedaliah', heb: 'צום גדליה' },
  'Tzom Gedaliah': { en: 'Tzom Gedaliah', heb: 'צום גדליה' },
  'Asara B\'Tevet': { en: 'Asara B\'Tevet', heb: 'עשרה בטבת' },
  'Yom HaShoah': { en: 'Yom HaShoah', heb: 'יום השואה' },
  '17 of Tammuz': { en: '17 of Tammuz', heb: 'י״ז בתמוז' },
  '10 of Tevet': { en: '10 of Tevet', heb: 'עשרה בטבת' },
  'Israel Independence Day': { en: 'Israel Independence Day', heb: 'יום העצמאות' },
  'Lag B\'Omer': { en: 'Lag B\'Omer', heb: 'ל״ג בעומר' },
  'Yom HaZikaron': { en: 'Yom HaZikaron', heb: 'יום הזיכרון' },
  'Tu B\'Av': { en: 'Tu B\'Av', heb: 'ט״ו באב' },
  'Rosh Chodesh': { en: 'Rosh Chodesh', heb: 'ראש חודש' },
  'Sefirat HaOmer': { en: 'Sefirat HaOmer', heb: 'ספירת העומר' },
};

export const HOLIDAY_DESCRIPTIONS = {
  // Passover
  'Pesach': 'Passover - Festival of Freedom (7 days)',
  'Erev Pesach': 'Eve of Passover',
  'Chol HaMoed Pesach': 'Intermediate days of Passover',
  
  // Shavuot
  'Shavuot': 'Feast of Weeks (2 days)',
  'Erev Shavuot': 'Eve of Shavuot',
  
  // Rosh Hashanah
  'Rosh Hashana': 'Jewish New Year (2 days)',
  'Erev Rosh Hashana': 'Eve of Rosh Hashanah',
  
  // Yom Kippur
  'Yom Kippur': 'Day of Atonement - Major fast day',
  'Erev Yom Kippur': 'Eve of Yom Kippur',
  
  // Sukkot
  'Sukkot': 'Feast of Tabernacles (7 days)',
  'Chol HaMoed Sukkot': 'Intermediate days of Sukkot',
  'Erev Sukkot': 'Eve of Sukkot',
  'Lulav & Etrog': 'Sukkot celebration day',
  'Shemini Atzeret': 'Eighth day of assembly',
  'Simchat Torah': 'Rejoicing of the Torah',
  
  // Hanukkah
  'Hanukkah': 'Festival of Lights (8 days)',
  
  // Tu B\'Shevat
  'Tu B\'Shevat': 'New Year for Trees',
  
  // Purim
  'Purim': 'Festival of Lots',
  'Shushan Purim': 'Purim in Jerusalem',
  'Erev Purim': 'Eve of Purim',
  
  // Fasts
  'Tisha B\'Av': 'Ninth of Av - Major fast day (destruction of Temple)',
  'Fast of Gedaliah': 'Fast commemorating assassination of Gedaliah',
  'Yom HaShoah': 'Holocaust Remembrance Day',
  '17 of Tammuz': 'Fast of the 17th of Tammuz',
  '10 of Tevet': 'Fast of 10th of Tevet',
  
  // Independence & Remembrance
  'Israel Independence Day': 'Yom Ha\'atzmaut - Israeli independence',
  'Lag B\'Omer': 'Spring holiday and Jewish pride',
  'Yom HaZikaron': 'Israeli Fallen Soldiers and Victims of Terror Remembrance Day',
  
  // Sefirat HaOmer (dynamically named with day count)
  'Sefirat HaOmer': 'Counting of the Omer - 49 days from Passover to Shavuot',
  
  // Other
  'Rosh Chodesh': 'Beginning of Hebrew month',
};

export const HOLIDAY_CATEGORIES_MAP = {
  // Yom Tov (major holidays)
  'Pesach': HOLIDAY_CATEGORIES.YOM_TOV,
  'Shavuot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Rosh Hashana': HOLIDAY_CATEGORIES.YOM_TOV,
  'Yom Kippur': HOLIDAY_CATEGORIES.YOM_TOV,
  'Sukkot': HOLIDAY_CATEGORIES.YOM_TOV,
  'Shemini Atzeret': HOLIDAY_CATEGORIES.YOM_TOV,
  'Simchat Torah': HOLIDAY_CATEGORIES.YOM_TOV,
  
  // Intermediate days
  'Chol HaMoed Pesach': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Chol HaMoed Sukkot': HOLIDAY_CATEGORIES.INTERMEDIATE,
  
  // Eves
  'Erev Pesach': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Erev Shavuot': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Erev Rosh Hashana': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Erev Yom Kippur': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Erev Sukkot': HOLIDAY_CATEGORIES.INTERMEDIATE,
  'Erev Purim': HOLIDAY_CATEGORIES.MINOR,
  
  // Fasts
  'Yom Kippur': HOLIDAY_CATEGORIES.FAST,
  'Tisha B\'Av': HOLIDAY_CATEGORIES.FAST,
  'Fast of Gedaliah': HOLIDAY_CATEGORIES.FAST,
  '17 of Tammuz': HOLIDAY_CATEGORIES.FAST,
  '10 of Tevet': HOLIDAY_CATEGORIES.FAST,
  
  // Minor/Observances
  'Hanukkah': HOLIDAY_CATEGORIES.MINOR,
  'Tu B\'Shevat': HOLIDAY_CATEGORIES.MINOR,
  'Purim': HOLIDAY_CATEGORIES.MINOR,
  'Shushan Purim': HOLIDAY_CATEGORIES.MINOR,
  'Lag B\'Omer': HOLIDAY_CATEGORIES.MINOR,
  'Yom HaShoah': HOLIDAY_CATEGORIES.OBSERVANCE,
  'Yom HaZikaron': HOLIDAY_CATEGORIES.OBSERVANCE,
  'Israel Independence Day': HOLIDAY_CATEGORIES.OBSERVANCE,
  'Rosh Chodesh': HOLIDAY_CATEGORIES.OBSERVANCE,
  'Lulav & Etrog': HOLIDAY_CATEGORIES.MINOR,
};

// Handle dynamic Sefirat HaOmer day names
export function getHolidayCategoryDynamic(holidayName) {
  if (holidayName && holidayName.startsWith('Sefirat HaOmer')) {
    return HOLIDAY_CATEGORIES.OBSERVANCE;
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
  [HOLIDAY_CATEGORIES.INTERMEDIATE]: { bg: 'bg-orange-100 dark:bg-orange-950', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300' },
  [HOLIDAY_CATEGORIES.FAST]: { bg: 'bg-slate-200 dark:bg-slate-800', border: 'border-slate-400 dark:border-slate-600', text: 'text-slate-700 dark:text-slate-300' },
  [HOLIDAY_CATEGORIES.MINOR]: { bg: 'bg-blue-100 dark:bg-blue-950', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300' },
  [HOLIDAY_CATEGORIES.OBSERVANCE]: { bg: 'bg-purple-100 dark:bg-purple-950', border: 'border-purple-300 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300' },
};

export function getHolidayColor(holidayName) {
  const category = getHolidayCategory(holidayName);
  return HOLIDAY_COLORS[category] || HOLIDAY_COLORS[HOLIDAY_CATEGORIES.MINOR];
}