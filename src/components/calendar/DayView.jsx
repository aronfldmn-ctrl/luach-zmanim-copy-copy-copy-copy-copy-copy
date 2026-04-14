import React from "react";
import { format } from "date-fns";
import { getHebrewDate, getJewishHoliday, isShabbat, isFriday, formatZmanTime } from "@/lib/hebrewDateUtils";
import { useSettings, ALL_ZMANIM, HEB_UI } from "@/lib/settingsContext";
import { useZmanim } from "@/lib/useZmanim";
import { getHolidayCategory } from "@/lib/holidayUtils";
import HolidayBadge from "./HolidayBadge";
import { Sunrise, Sun, Sunset, Flame, Moon, Star, Clock } from "lucide-react";
import SidePanel from "./SidePanel";

const ZMAN_COLORS_BG = {
  alotHaShachar: "bg-indigo-50 text-indigo-700 border-indigo-200",
  zmanTzitzit: "bg-violet-50 text-violet-700 border-violet-200",
  sunrise: "bg-amber-50 text-amber-700 border-amber-200",
  sofShmaGRA: "bg-sky-50 text-sky-700 border-sky-200",
  sofShmaMA: "bg-sky-50 text-sky-600 border-sky-200",
  sofTfila: "bg-blue-50 text-blue-700 border-blue-200",
  midday: "bg-yellow-50 text-yellow-700 border-yellow-200",
  minchaGedolah: "bg-orange-50 text-orange-600 border-orange-200",
  plagHaMincha: "bg-orange-50 text-orange-700 border-orange-200",
  sunset: "bg-orange-100 text-orange-700 border-orange-200",
  candleLighting: "bg-amber-100 text-amber-700 border-amber-200",
  tzeitKochavim: "bg-indigo-100 text-indigo-700 border-indigo-200",
  rabbeinuTam: "bg-purple-50 text-purple-700 border-purple-200",
};

const ZMAN_ICONS = {
  alotHaShachar: Moon, zmanTzitzit: Star, sunrise: Sunrise,
  sofShmaGRA: Clock, sofShmaMA: Clock, sofTfila: Clock,
  midday: Sun, minchaGedolah: Sun, plagHaMincha: Sunset,
  sunset: Sunset, candleLighting: Flame, tzeitKochavim: Moon, rabbeinuTam: Moon,
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function timeToMinutes(timeStr) {
  if (!timeStr || timeStr === "...") return -1;
  const match = timeStr.match(/^(\d+):(\d+)(?::\d+)?\s(AM|PM)$/);
  if (!match) return -1;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const ampm = match[3];
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function timeToHour(timeStr) {
  const mins = timeToMinutes(timeStr);
  return mins === -1 ? -1 : Math.floor(mins / 60);
}

export default function DayView({ date }) {
  const { showZmanim, zmanimVisible, hebrewMode, showZmanimSeconds, holidayFilters } = useSettings();
  const { zmanim } = useZmanim(date);
  const hebrewDate = getHebrewDate(date);
  const holiday = getJewishHoliday(date);
  const shabbat = isShabbat(date);
  const friday = isFriday(date);

  const t = (en, heb) => hebrewMode ? heb : en;

  const activeZmanim = showZmanim
    ? ALL_ZMANIM.filter((z) => {
        if (z.key === "candleLighting" && !friday) return false;
        return !!zmanimVisible[z.key];
      })
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeline */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-semibold text-lg">{format(date, "EEEE")}</h2>
              <p className="text-sm text-muted-foreground font-body">{format(date, "MMMM d, yyyy")}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-heading font-bold text-accent">{hebrewDate.dayHeb}</p>
              <p className="text-sm text-muted-foreground font-body">{hebrewDate.monthNameHeb} {hebrewDate.year}</p>
            </div>
          </div>
          {holiday && holidayFilters[getHolidayCategory(holiday)] && (
            <div className="mt-3">
              <HolidayBadge holiday={holiday} compact={false} />
            </div>
          )}
          {shabbat && !holiday && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground">
              <p className="text-sm font-body font-semibold">{t("Shabbat Kodesh", "שבת קודש")}</p>
            </div>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {HOURS.map((hour) => {
            const eventsThisHour = activeZmanim
              .filter((z) => timeToHour(zmanim[z.key]) === hour)
              .sort((a, b) => timeToMinutes(zmanim[a.key]) - timeToMinutes(zmanim[b.key]));
            return (
              <div key={hour} className="flex border-b border-border/30 min-h-[52px]">
                <div className="w-16 flex-shrink-0 text-right pr-3 pt-2">
                  <span className="text-xs text-muted-foreground font-body tabular-nums">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                </div>
                <div className="flex-1 border-l border-border/50 pl-3 py-1.5 space-y-1">
                  {eventsThisHour.map((z) => {
                    const Icon = ZMAN_ICONS[z.key] || Clock;
                    const color = ZMAN_COLORS_BG[z.key] || "bg-muted text-foreground border-border";
                    return (
                      <div key={z.key} className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-body ${color}`}>
                        <Icon className="h-3 w-3 flex-shrink-0" />
                        {/* Show Hebrew label when in Hebrew mode */}
                        <span className="font-medium">{t(z.labelEn, z.labelHeb)}</span>
                        <span className="ml-auto tabular-nums opacity-80">{formatZmanTime(zmanim[z.key], showZmanimSeconds)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side panel with Zmanim/Weather tabs */}
      <div>
        <SidePanel date={date} />
      </div>
    </div>
  );
}