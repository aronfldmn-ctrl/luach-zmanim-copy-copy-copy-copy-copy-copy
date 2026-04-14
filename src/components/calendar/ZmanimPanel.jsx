import React from "react";
import { Sunrise, Sun, Sunset, Flame, Moon, Star, Clock, Loader2 } from "lucide-react";
import { isFriday, isShabbat, getJewishHoliday, getHebrewDate, formatZmanTime } from "@/lib/hebrewDateUtils";
import { useSettings, ALL_ZMANIM, HEB_UI } from "@/lib/settingsContext";
import { useZmanim } from "@/lib/useZmanim";
import { format } from "date-fns";

const ZMAN_ICONS = {
  alotHaShachar: Moon, zmanTzitzit: Star, sunrise: Sunrise,
  sofShmaGRA: Clock, sofShmaMA: Clock, sofTfila: Clock,
  midday: Sun, minchaGedolah: Sun, plagHaMincha: Sunset,
  sunset: Sunset, candleLighting: Flame, tzeitKochavim: Moon, rabbeinuTam: Moon,
};

const ZMAN_COLORS = {
  alotHaShachar: "text-indigo-400", zmanTzitzit: "text-violet-400",
  sunrise: "text-amber-500", sofShmaGRA: "text-sky-500",
  sofShmaMA: "text-sky-400", sofTfila: "text-blue-500",
  midday: "text-yellow-500", minchaGedolah: "text-orange-400",
  plagHaMincha: "text-orange-500", sunset: "text-orange-600",
  candleLighting: "text-amber-600", tzeitKochavim: "text-indigo-500",
  rabbeinuTam: "text-purple-500",
};

export default function ZmanimPanel({ date }) {
  const { zmanimVisible, showZmanim, hebrewMode, candleLightingMinutes, showZmanimSeconds } = useSettings();
  const { zmanim, loading } = useZmanim(date);
  const holiday = getJewishHoliday(date);
  const hebrewDate = getHebrewDate(date);
  const friday = isFriday(date);
  const shabbat = isShabbat(date);

  const t = (en, heb) => hebrewMode ? heb : en;

  if (!showZmanim) return null;

  const visibleZmanim = ALL_ZMANIM.filter((z) => {
    if (z.key === "candleLighting" && !friday) return false;
    return !!zmanimVisible[z.key];
  });

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-semibold text-foreground text-lg">{t("Zmanim", HEB_UI.zmanim)}</h3>
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            {format(date, "EEEE, MMM d")} · {hebrewDate.displayEn}
          </p>
          <p className="text-[10px] text-muted-foreground font-body opacity-60 mt-0.5">
            {t("via KosherJava (local)", "מקור: KosherJava")}
          </p>
        </div>
        {(holiday || shabbat) && (
          <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium font-body">
            {holiday || t("Shabbat", "שבת")}
          </span>
        )}
      </div>

      {visibleZmanim.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body text-center py-4">{t("No zmanim enabled", HEB_UI.no_zmanim)}</p>
      ) : (
        <div className="space-y-1">
          {visibleZmanim.map((z) => {
            const Icon = ZMAN_ICONS[z.key] || Clock;
            const color = ZMAN_COLORS[z.key] || "text-muted-foreground";
            return (
              <div key={z.key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-body text-sm text-foreground leading-tight">
                      {t(z.labelEn, z.labelHeb)}
                      {z.key === "candleLighting" && (
                        <span className="text-[10px] text-muted-foreground ml-1">({candleLightingMinutes} {t("min", "דק'")})</span>
                      )}
                    </p>
                    {/* Only show Hebrew subtitle in English mode */}
                    {!hebrewMode && (
                      <p className="font-body text-[10px] text-muted-foreground" dir="rtl">{z.labelHeb}</p>
                    )}
                  </div>
                </div>
                <span className={`font-body font-semibold text-sm tabular-nums ${loading ? "text-muted-foreground" : "text-foreground"}`}>
                  {formatZmanTime(zmanim[z.key], showZmanimSeconds)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {friday && zmanimVisible.candleLighting && (
        <div className="mt-4 p-3 rounded-md bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            <span className="font-body text-sm font-medium text-accent">{t("Shabbat Shalom!", HEB_UI.shabbat_shalom)}</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-1">
            {t("Light candles at", HEB_UI.light_candles_at)} <strong className="text-foreground">{formatZmanTime(zmanim.candleLighting, showZmanimSeconds)}</strong>
            <span className="ml-1 text-[10px]">({candleLightingMinutes} {t("min before sunset", `${HEB_UI.min_before_sunset}`)})</span>
          </p>
        </div>
      )}

      {shabbat && (
        <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/20">
          <span className="font-body text-sm font-medium text-primary">{t("Shabbat Shalom!", HEB_UI.shabbat_shalom)}</span>
          <p className="text-xs text-muted-foreground font-body mt-1">
            {t("Havdalah after", HEB_UI.havdalah_after)} {formatZmanTime(zmanim.tzeitKochavim, showZmanimSeconds)}
          </p>
        </div>
      )}
    </div>
  );
}