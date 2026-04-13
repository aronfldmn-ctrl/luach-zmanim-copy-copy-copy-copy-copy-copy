// Weekly Torah Portion (Parashat HaShavua) calculator
// Parasha cycle is based on Shabbat of each week

// Full parasha list in order
const PARASHIYOT = [
  { en: "Bereishit",     heb: "בְּרֵאשִׁית" },
  { en: "Noach",         heb: "נֹחַ" },
  { en: "Lech Lecha",    heb: "לֶךְ-לְךָ" },
  { en: "Vayera",        heb: "וַיֵּרָא" },
  { en: "Chayei Sara",   heb: "חַיֵּי שָׂרָה" },
  { en: "Toldot",        heb: "תּוֹלְדֹת" },
  { en: "Vayetzei",      heb: "וַיֵּצֵא" },
  { en: "Vayishlach",    heb: "וַיִּשְׁלַח" },
  { en: "Vayeshev",      heb: "וַיֵּשֶׁב" },
  { en: "Miketz",        heb: "מִקֵּץ" },
  { en: "Vayigash",      heb: "וַיִּגַּשׁ" },
  { en: "Vayechi",       heb: "וַיְחִי" },
  { en: "Shemot",        heb: "שְׁמוֹת" },
  { en: "Vaera",         heb: "וָאֵרָא" },
  { en: "Bo",            heb: "בֹּא" },
  { en: "Beshalach",     heb: "בְּשַׁלַּח" },
  { en: "Yitro",         heb: "יִתְרוֹ" },
  { en: "Mishpatim",     heb: "מִּשְׁפָּטִים" },
  { en: "Terumah",       heb: "תְּרוּמָה" },
  { en: "Tetzaveh",      heb: "תְּצַוֶּה" },
  { en: "Ki Tisa",       heb: "כִּי תִשָּׂא" },
  { en: "Vayakhel",      heb: "וַיַּקְהֵל" },
  { en: "Pekudei",       heb: "פְקוּדֵי" },
  { en: "Vayikra",       heb: "וַיִּקְרָא" },
  { en: "Tzav",          heb: "צַו" },
  { en: "Shemini",       heb: "שְּׁמִינִי" },
  { en: "Tazria",        heb: "תַזְרִיעַ" },
  { en: "Metzora",       heb: "מְּצֹרָע" },
  { en: "Acharei Mot",   heb: "אַחֲרֵי מוֹת" },
  { en: "Kedoshim",      heb: "קְדֹשִׁים" },
  { en: "Emor",          heb: "אֱמֹר" },
  { en: "Behar",         heb: "בְּהַר" },
  { en: "Bechukotai",    heb: "בְּחֻקֹּתַי" },
  { en: "Bamidbar",      heb: "בְּמִדְבַּר" },
  { en: "Nasso",         heb: "נָשֹׂא" },
  { en: "Beha'alotcha",  heb: "בְּהַעֲלֹתְךָ" },
  { en: "Shelach",       heb: "שְׁלַח" },
  { en: "Korach",        heb: "קֹרַח" },
  { en: "Chukat",        heb: "חֻקַּת" },
  { en: "Balak",         heb: "בָּלָק" },
  { en: "Pinchas",       heb: "פִּינְחָס" },
  { en: "Matot",         heb: "מַּטּוֹת" },
  { en: "Masei",         heb: "מַסְעֵי" },
  { en: "Devarim",       heb: "דְּבָרִים" },
  { en: "Vaetchanan",    heb: "וָאֶתְחַנַּן" },
  { en: "Eikev",         heb: "עֵקֶב" },
  { en: "Re'eh",         heb: "רְאֵה" },
  { en: "Shoftim",       heb: "שֹׁפְטִים" },
  { en: "Ki Teitzei",    heb: "כִּי-תֵצֵא" },
  { en: "Ki Tavo",       heb: "כִּי-תָבוֹא" },
  { en: "Nitzavim",      heb: "נִצָּבִים" },
  { en: "Vayeilech",     heb: "וַיֵּלֶךְ" },
  { en: "Haazinu",       heb: "הַאֲזִינוּ" },
  { en: "Vezot Habracha",heb: "וְזֹאת הַבְּרָכָה" },
];

// Known Shabbat -> parasha index mapping using a reference date
// Simchat Torah 5784 ended Oct 7 2023, so Bereishit was read Oct 7 2023 (Shabbat)
// We use a known anchor: Shabbat Oct 7, 2023 = Bereishit (index 0)
const ANCHOR_DATE = new Date(2023, 9, 7); // Oct 7, 2023 - Bereishit
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Get the Shabbat (Saturday) of the week containing the given date
function getShabbatOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 6=Sat
  const diff = (6 - day + 7) % 7;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Special combined parashiyot (in diaspora, some are read together)
// Map from the "first" parasha index to combined name
const COMBINED = {
  21: { en: "Vayakhel-Pekudei", heb: "וַיַּקְהֵל-פְקוּדֵי" },
  26: { en: "Tazria-Metzora",   heb: "תַזְרִיעַ-מְּצֹרָע" },
  28: { en: "Acharei-Kedoshim", heb: "אַחֲרֵי מוֹת-קְדֹשִׁים" },
  31: { en: "Behar-Bechukotai", heb: "בְּהַר-בְּחֻקֹּתַי" },
  41: { en: "Matot-Masei",      heb: "מַּטּוֹת-מַסְעֵי" },
  50: { en: "Nitzavim-Vayeilech", heb: "נִצָּבִים-וַיֵּלֶךְ" },
};

/**
 * Returns the parasha for the week containing the given date.
 * @param {Date} date
 * @returns {{ en: string, heb: string } | null}
 */
export function getParasha(date) {
  const shabbat = getShabbatOfWeek(date);
  const anchorShabbat = getShabbatOfWeek(ANCHOR_DATE);

  const weeksDiff = Math.round((shabbat - anchorShabbat) / MS_PER_WEEK);
  // 54 parashiyot in the cycle (some years 53, but we use 54 as modulus works fine)
  const idx = ((weeksDiff % 54) + 54) % 54;

  // Check if this week is a combined parasha
  if (COMBINED[idx]) return COMBINED[idx];
  if (idx < PARASHIYOT.length) return PARASHIYOT[idx];
  return null;
}

/**
 * Returns true if the given date is a Shabbat (Saturday)
 */
export function isThisWeeksShabbat(date) {
  return date.getDay() === 6;
}