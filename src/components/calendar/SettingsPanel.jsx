import React, { useState, useRef } from "react";
import { Settings, X, MapPin, Search, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettings, ALL_ZMANIM, HEB_UI } from "@/lib/settingsContext";
import { base44 } from "@/api/base44Client";
import ZmanimSync from "./ZmanimSync";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);

  const {
    location, setLocation,
    zmanimVisible, setZmanimVisible,
    showZmanim, setShowZmanim,
    showWeather, setShowWeather,
    candleLightingMinutes, setCandleLightingMinutes,
    hebrewMode, setHebrewMode,
    celsiusMode, setCelsiusMode,
    showZmanimSeconds, setShowZmanimSeconds,
    showStatusBar, setShowStatusBar,
    showDafYomi, setShowDafYomi,
    enableNotifications, setEnableNotifications,
    autoSyncLocation, setAutoSyncLocation,
  } = useSettings();

  const t = (en, heb) => hebrewMode ? heb : en;

  const handleCitySearch = (val) => {
    setCitySearch(val);
    clearTimeout(searchTimeout.current);
    if (val.length < 2) { setSearchResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&addressdetails=1`
        );
        const data = await res.json();
        setSearchResults(data.map(d => ({
          name: d.display_name.split(",").slice(0, 3).join(","),
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon),
          tzid: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const handleSelectCity = async (result) => {
    let tzid = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      const tzRes = await fetch(
        `https://timezonefinder.michelfe.it/api/0?lat=${result.lat}&lng=${result.lng}`
      );
      const tzData = await tzRes.json();
      if (tzData.timezone_id) tzid = tzData.timezone_id;
    } catch {}
    setLocation({ ...result, tzid });
    setCitySearch("");
    setSearchResults([]);
  };

  const toggleZman = (key) => {
    setZmanimVisible({ ...zmanimVisible, [key]: !zmanimVisible[key] });
  };

  const adjustCandle = (delta) => {
    const next = Math.max(1, Math.min(60, candleLightingMinutes + delta));
    setCandleLightingMinutes(next);
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 focus:ring-2 focus:ring-primary"
        title={t("Settings", HEB_UI.settings)}
        tabIndex={0}
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      <div className="relative ml-auto w-full max-w-sm bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading font-semibold text-lg">{t("Settings", HEB_UI.settings)}</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-7">

          {/* Language */}
          <section>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {t("Language", HEB_UI.language)}
                </h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  {t("Switch to Hebrew UI", "עברית")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-body text-muted-foreground">EN</span>
                <Switch checked={hebrewMode} onCheckedChange={setHebrewMode} />
                <span className="text-xs font-body text-muted-foreground">עב</span>
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              {t("Location", HEB_UI.location)}
            </h3>
            <div className="flex items-center gap-2 mb-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-body font-medium leading-tight">{location.name}</p>
                <p className="text-xs text-muted-foreground font-body">
                  {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={t("Search city...", HEB_UI.search_city)}
                  value={citySearch}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  className="pl-9 text-sm font-body h-9"
                />
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              </div>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectCity(r)}
                      className="w-full text-left px-3 py-2.5 text-sm font-body hover:bg-muted border-b border-border/50 last:border-0 transition-colors focus:outline-none focus:bg-muted"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Candle Lighting Minutes */}
          <section>
            <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              {t("Candle Lighting", HEB_UI.candle_lighting_minutes)}
            </h3>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => adjustCandle(-1)}
                tabIndex={0}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="flex-1 text-center">
                <p className="text-2xl font-heading font-bold text-foreground">{candleLightingMinutes}</p>
                <p className="text-xs text-muted-foreground font-body">{t("minutes before sunset", "דק' לפני שקיעה")}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => adjustCandle(1)}
                tabIndex={0}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-2 text-center">
              {t("Common: 18 min (Ashkenaz), 40 min (Yerushalayim)", "נהוג: 18 דק' (אשכנז), 40 דק' (ירושלים)")}
            </p>
          </section>

          {/* Zmanim toggle */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {t("Show Zmanim", HEB_UI.show_zmanim)}
              </h3>
              <Switch checked={showZmanim} onCheckedChange={setShowZmanim} />
            </div>

            {showZmanim && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-muted rounded-lg mb-3">
                <p className="text-sm font-body font-medium">{t("Show Seconds", "הצג שניות")}</p>
                <Switch checked={showZmanimSeconds} onCheckedChange={setShowZmanimSeconds} />
              </div>
            )}

            {showZmanim && (
              <div className="space-y-1 border border-border rounded-lg overflow-hidden">
                {ALL_ZMANIM.map((z) => (
                  <div
                    key={z.key}
                    className="flex items-center justify-between px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-body font-medium">{t(z.labelEn, z.labelHeb)}</p>
                      {!hebrewMode && <p className="text-xs text-muted-foreground font-body" dir="rtl">{z.labelHeb}</p>}
                    </div>
                    <Switch
                      checked={!!zmanimVisible[z.key]}
                      onCheckedChange={() => toggleZman(z.key)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Status Bar toggle */}
          <section>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  {t("Top Status Bar", "סרגל עליון")}
                </h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  {t("Hebrew date & weather at top", "תאריך עברי ומזג אוויר בראש")}
                </p>
              </div>
              <Switch checked={showStatusBar} onCheckedChange={setShowStatusBar} />
            </div>
          </section>

          {/* Weather toggle */}
           <section>
             <div className="flex items-center justify-between mb-3">
               <div>
                 <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                   {t("Show Weather", HEB_UI.show_weather)}
                 </h3>
                 <p className="text-xs text-muted-foreground font-body mt-0.5">{t("Display local weather info", "הצג מזג אוויר מקומי")}</p>
               </div>
               <Switch checked={showWeather} onCheckedChange={setShowWeather} />
             </div>
             {showWeather && (
               <div className="flex items-center justify-between px-3 py-2.5 bg-muted rounded-lg">
                 <p className="text-sm font-body font-medium">{t("Temperature Unit", "יחידת טמפרטורה")}</p>
                 <div className="flex items-center gap-2">
                   <span className={`text-xs font-body ${!celsiusMode ? "font-semibold text-foreground" : "text-muted-foreground"}`}>°F</span>
                   <Switch checked={celsiusMode} onCheckedChange={setCelsiusMode} />
                   <span className={`text-xs font-body ${celsiusMode ? "font-semibold text-foreground" : "text-muted-foreground"}`}>°C</span>
                 </div>
               </div>
             )}
           </section>

           {/* Daf Yomi toggle */}
           <section>
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                   {t("Daf Yomi", HEB_UI.daf_yomi)}
                 </h3>
                 <p className="text-xs text-muted-foreground font-body mt-0.5">{t("Daily Talmud page", "דף גמרא יומי")}</p>
               </div>
               <Switch checked={showDafYomi} onCheckedChange={setShowDafYomi} />
             </div>
            </section>

            {/* Notifications toggle */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    {t("Notifications", HEB_UI.notifications)}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{t("Weather and Hebrew date alerts", HEB_UI.enable_notifications)}</p>
                </div>
                <Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} />
              </div>
            </section>

            {/* Auto-sync Location */}
            <section>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    {t("Auto-sync Location", HEB_UI.auto_sync_location)}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {t("Automatically detect and update your location", HEB_UI.auto_sync_location_desc)}
                  </p>
                </div>
                <Switch checked={autoSyncLocation} onCheckedChange={setAutoSyncLocation} />
              </div>
            </section>

            {/* Zmanim Calendar Sync */}
            <section>
              <ZmanimSync />
            </section>

            </div>
      </div>
    </div>
  );
}