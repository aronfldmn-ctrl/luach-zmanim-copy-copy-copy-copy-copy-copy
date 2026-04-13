import React, { useState, useRef } from "react";
import { Settings, X, MapPin, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettings, ALL_ZMANIM } from "@/lib/settingsContext";
import { base44 } from "@/api/base44Client";

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
  } = useSettings();

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
        })));
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const handleSelectCity = (result) => {
    setLocation(result);
    setCitySearch("");
    setSearchResults([]);
  };

  const toggleZman = (key) => {
    setZmanimVisible({ ...zmanimVisible, [key]: !zmanimVisible[key] });
  };

  if (!open) {
    return (
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} className="h-9 w-9" title="Settings">
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-sm bg-card border-l border-border shadow-2xl flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading font-semibold text-lg">Settings</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-7">

          {/* Location */}
          <section>
            <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              Location
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
                  placeholder="Search city..."
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
                      className="w-full text-left px-3 py-2.5 text-sm font-body hover:bg-muted border-b border-border/50 last:border-0 transition-colors"
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Zmanim toggle */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Show Zmanim
              </h3>
              <Switch checked={showZmanim} onCheckedChange={setShowZmanim} />
            </div>

            {showZmanim && (
              <div className="space-y-1 border border-border rounded-lg overflow-hidden">
                {ALL_ZMANIM.map((z, i) => (
                  <div
                    key={z.key}
                    className="flex items-center justify-between px-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-body font-medium">{z.labelEn}</p>
                      <p className="text-xs text-muted-foreground font-body" dir="rtl">{z.labelHeb}</p>
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

          {/* Weather toggle */}
          <section>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Show Weather
                </h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">Display local weather info</p>
              </div>
              <Switch checked={showWeather} onCheckedChange={setShowWeather} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}