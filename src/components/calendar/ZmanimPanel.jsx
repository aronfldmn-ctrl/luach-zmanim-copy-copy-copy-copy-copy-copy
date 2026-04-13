import React from "react";
import { Sunrise, Sun, Sunset, Flame } from "lucide-react";
import { getZmanim, isFriday, isShabbat, getJewishHoliday, getHebrewDate } from "@/lib/hebrewDateUtils";
import { format } from "date-fns";

export default function ZmanimPanel({ date, compact = false }) {
  const zmanim = getZmanim(date);
  const holiday = getJewishHoliday(date);
  const hebrewDate = getHebrewDate(date);
  const friday = isFriday(date);
  const shabbat = isShabbat(date);

  const items = [
    { label: "Sunrise", icon: Sunrise, time: zmanim.sunrise, color: "text-amber-500" },
    { label: "Midday", icon: Sun, time: zmanim.midday, color: "text-yellow-500" },
    { label: "Sunset", icon: Sunset, time: zmanim.sunset, color: "text-orange-600" },
  ];

  if (friday) {
    items.push({ label: "Candle Lighting", icon: Flame, time: zmanim.candleLighting, color: "text-accent" });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <item.icon className={`h-3 w-3 ${item.color}`} />
            {item.time}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-lg">
            Zmanim
          </h3>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            {format(date, "EEEE, MMM d")} · {hebrewDate.displayEn}
          </p>
        </div>
        {(holiday || shabbat) && (
          <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium font-body">
            {holiday || "Shabbat"}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <span className="font-body text-sm text-foreground">{item.label}</span>
            </div>
            <span className="font-body font-semibold text-sm text-foreground tabular-nums">
              {item.time}
            </span>
          </div>
        ))}
      </div>

      {friday && (
        <div className="mt-4 p-3 rounded-md bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            <span className="font-body text-sm font-medium text-accent">Shabbat Shalom!</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Light candles at {zmanim.candleLighting}
          </p>
        </div>
      )}

      {shabbat && (
        <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/20">
          <span className="font-body text-sm font-medium text-primary">Shabbat Shalom!</span>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Havdalah after {zmanim.sunset}
          </p>
        </div>
      )}
    </div>
  );
}