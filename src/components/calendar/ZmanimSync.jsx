import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Loader2, Trash2, Download } from "lucide-react";
import { useSettings, HEB_UI, ALL_ZMANIM } from "@/lib/settingsContext";
import { fetchZmanim, getHebrewDate } from "@/lib/hebrewDateUtils";
import { addDays, format } from "date-fns";

const ZMANIM_MARKER = "[ZMANIM_SYNC]";

const SYNC_DURATION_OPTIONS = [7, 14, 30, 60];

export default function ZmanimSync() {
  const { location, syncZmanimDays, setSyncZmanimDays, hebrewMode, zmanimVisible } = useSettings();
  const [syncing, setSyncing] = useState(false);

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
              const zmanimTime = zmanim[z.key];
              return zmanimTime ? `${zmanimLabel}: ${zmanimTime}` : null;
            })
            .filter(Boolean)
            .join("\n");

          const description = `${ZMANIM_MARKER}\n${heb.displayHeb}\n${location.name}\n\n${enabledZmanim}`;

          events.push({
            title: `${format(date, "MMM d")} - ${heb.dayHeb}`,
            description,
            date: date.toISOString().split("T")[0],
          });
        }
      }

      // Create calendar entries
      if ("calendar" in navigator) {
        for (const event of events) {
          try {
            await navigator.calendar.createEvent({
              title: event.title,
              description: event.description,
              startDate: event.date,
            });
          } catch (err) {
            console.error("Error creating calendar event:", err);
          }
        }
      }

      // Fallback: generate ICS file for download
      if (events.length > 0) {
        generateAndDownloadICS(events);
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleImportFromCalendar = async () => {
    setSyncing(true);
    try {
      if (!("calendar" in navigator)) {
        alert(t("Calendar API not available", "Calendar API לא זמין"));
        return;
      }

      const today = new Date();
      const endDate = addDays(today, syncZmanimDays);

      // Request access to calendar events in date range
      const events = await navigator.calendar.getEvents({
        from: today.toISOString().split("T")[0],
        to: endDate.toISOString().split("T")[0],
      });

      // Filter for synced events (those with the marker)
      const syncedEvents = events.filter(e => 
        e.description && e.description.includes(ZMANIM_MARKER)
      );

      if (syncedEvents.length === 0) {
        alert(t("No synced events found", "לא נמצאו אירועים מסונכרנים"));
        return;
      }

      // Store IDs for potential deletion
      localStorage.setItem(
        "jcal_synced_event_ids",
        JSON.stringify(syncedEvents.map(e => e.id))
      );

      alert(t(`Imported ${syncedEvents.length} events`, `${syncedEvents.length} אירועים יובאו`));
    } catch (error) {
      console.error("Import error:", error);
      alert(t("Error importing events", "שגיאה בייבוא אירועים"));
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteSyncedEvents = async () => {
    if (!confirm(t("Delete all synced events?", "למחוק את כל האירועים המסונכרנים?"))) {
      return;
    }

    setSyncing(true);
    try {
      const eventIds = JSON.parse(localStorage.getItem("jcal_synced_event_ids") || "[]");

      if ("calendar" in navigator) {
        for (const id of eventIds) {
          try {
            await navigator.calendar.deleteEvent(id);
          } catch (err) {
            console.error("Error deleting event:", err);
          }
        }
      }

      localStorage.removeItem("jcal_synced_event_ids");
      alert(t("Synced events deleted", "אירועים מסונכרנים נמחקו"));
    } catch (error) {
      console.error("Delete error:", error);
      alert(t("Error deleting events", "שגיאה במחיקת אירועים"));
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
X-WR-TIMEZONE:${location.tzid || "America/New_York"}
BEGIN:VTIMEZONE
TZID:${location.tzid || "America/New_York"}
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0000
TZOFFSETTO:+0000
END:STANDARD
END:VTIMEZONE\n`;

    events.forEach((event) => {
      ics += `BEGIN:VEVENT
DTSTART:${event.date.replace(/-/g, "")}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
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

      <div className="flex gap-2">
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="flex-1 font-body"
        >
          {syncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("Syncing...", "סנכרון...")}
            </>
          ) : (
            <>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t("Export", "ייצוא")}
            </>
          )}
        </Button>

        <Button
          onClick={handleImportFromCalendar}
          disabled={syncing}
          variant="outline"
          className="flex-1 font-body"
          title={t("Import synced events from calendar", "ייבא אירועים מסונכרנים מהליומן")}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleDeleteSyncedEvents}
          disabled={syncing}
          variant="outline"
          className="flex-1 font-body"
          title={t("Delete synced events", "מחק אירועים מסונכרנים")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}