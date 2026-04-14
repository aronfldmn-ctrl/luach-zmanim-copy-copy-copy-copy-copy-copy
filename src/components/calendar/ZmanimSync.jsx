import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useSettings, HEB_UI, ALL_ZMANIM } from "@/lib/settingsContext";
import { fetchZmanim, getHebrewDate } from "@/lib/hebrewDateUtils";
import { addDays, format } from "date-fns";



const SYNC_DURATION_OPTIONS = [7, 14, 30, 60];

export default function ZmanimSync() {
  const { location, syncZmanimDays, setSyncZmanimDays, hebrewMode, zmanimVisible, showZmanimSeconds } = useSettings();
  const [syncing, setSyncing] = useState(false);
  const [syncMode, setSyncMode] = useState("export"); // "export" or "import"

  const t = (en, heb) => hebrewMode ? heb : en;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const tz = location.tzid || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const events = [];
      const today = new Date();

      // Fetch Zmanim for each day
      for (let i = 0; i < syncZmanimDays; i++) {
        const date = addDays(today, i);
        const heb = getHebrewDate(date);
        const zmanim = await fetchZmanim(date, location.lat, location.lng, tz, 18);
        
        if (zmanim) {
          // Build description with enabled Zmanim
          const enabledZmanim = ALL_ZMANIM
            .filter(z => zmanimVisible[z.key])
            .map(z => {
              const zmanimLabel = hebrewMode ? z.labelHeb : z.labelEn;
              let zmanimTime = zmanim[z.key];
              // Remove seconds if setting is disabled
              if (zmanimTime && !showZmanimSeconds) {
                zmanimTime = zmanimTime.split(":").slice(0, 2).join(":");
              }
              return zmanimTime ? `${zmanimLabel}: ${zmanimTime}` : null;
            })
            .filter(Boolean)
            .join("\n");

          const description = `${heb.displayHeb}\n${location.name}\n\n${enabledZmanim}`;

          events.push({
            title: `${format(date, "MMM d")} - ${heb.dayHeb}`,
            description,
            date: date.toISOString().split("T")[0],
            startTime: "00:00",
          });
        }
      }

      // Generate and download ICS file
      if (events.length > 0) {
        generateAndDownloadICS(events);
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert(t("Failed to sync zmanim", "נכשל בסנכרון הזמנים"));
    } finally {
      setSyncing(false);
    }
  };



  const generateAndDownloadICS = (events) => {
    const icsContent = generateICS(events);
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `zmanim_${new Date().toISOString().split("T")[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateICS = (events) => {
    const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jewish Calendar//Zmanim Sync//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Zmanim
X-WR-TIMEZONE:${location.tzid || "America/New_York"}\n`;

    events.forEach((event) => {
      const cleanDesc = event.description.replace(/\n/g, "\\n");
      ics += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${event.date.replace(/-/g, "")}
SUMMARY:${event.title}
DESCRIPTION:${cleanDesc}
UID:${Math.random().toString(36).substr(2, 9)}@jewishcalendar
DTSTAMP:${now}
END:VEVENT\n`;
    });

    ics += "END:VCALENDAR";
    return ics;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-body font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          {t("Sync Zmanim", HEB_UI.sync_zmanim)}
        </h3>
        <p className="text-xs text-muted-foreground font-body mb-3">
          {t("Sync prayer times to your phone calendar", HEB_UI.sync_zmanim_description)}
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSyncMode("export")}
          className={`flex-1 px-3 py-2 rounded text-sm font-body transition-colors ${
            syncMode === "export"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {t("Export", "ייצוא")}
        </button>
        <button
          onClick={() => setSyncMode("import")}
          className={`flex-1 px-3 py-2 rounded text-sm font-body transition-colors ${
            syncMode === "import"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {t("Import", "ייבוא")}
        </button>
      </div>

      {syncMode === "export" && (
        <>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <label className="text-sm font-body font-medium flex-1">
              {t("Duration (days)", HEB_UI.sync_duration_days)}
            </label>
            <select
              value={syncZmanimDays}
              onChange={(e) => setSyncZmanimDays(parseInt(e.target.value))}
              className="px-2 py-1.5 bg-card border border-border rounded text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SYNC_DURATION_OPTIONS.map((days) => (
                <option key={days} value={days}>
                  {days} {t("days", "ימים")}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleSync}
            disabled={syncing}
            className="w-full font-body"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("Syncing...", "סנכרון...")}
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4 mr-2" />
                {t("Export to Calendar", "ייצוא לליומן")}
              </>
            )}
          </Button>
        </>
      )}

      {syncMode === "import" && (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground font-body mb-3">
            {t("Import ICS calendar file", "ייבא קובץ ליומן ICS")}
          </p>
          <input
            type="file"
            accept=".ics"
            className="w-full text-sm font-body"
          />
        </div>
      )}
    </div>
  );
}