import React from "react";
import { format } from "date-fns";
import { getHebrewDate, getZmanim, getJewishHoliday, isShabbat, isFriday } from "@/lib/hebrewDateUtils";
import { Sunrise, Sun, Sunset, Flame, Star } from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function DayView({ date, onDateSelect }) {
  const hebrewDate = getHebrewDate(date);
  const zmanim = getZmanim(date);
  const holiday = getJewishHoliday(date);
  const shabbat = isShabbat(date);
  const friday = isFriday(date);

  const zmanimEvents = [
    { label: "Sunrise (הנץ)", time: zmanim.sunrise, icon: Sunrise, color: "bg-amber-100 text-amber-700 border-amber-200" },
    { label: "Chatzot (חצות)", time: zmanim.midday, icon: Sun, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { label: "Sunset (שקיעה)", time: zmanim.sunset, icon: Sunset, color: "bg-orange-100 text-orange-700 border-orange-200" },
  ];

  if (friday) {
    zmanimEvents.push({
      label: "Candle Lighting (הדלקת נרות)",
      time: zmanim.candleLighting,
      icon: Flame,
      color: "bg-accent/10 text-accent border-accent/20"
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main timeline */}
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
          {(holiday || shabbat) && (
            <div className="mt-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent font-body">{holiday || "Shabbat Kodesh"}</span>
            </div>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="flex border-b border-border/30 min-h-[48px]">
              <div className="w-16 flex-shrink-0 text-right pr-3 pt-1">
                <span className="text-xs text-muted-foreground font-body tabular-nums">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
              <div className="flex-1 border-l border-border/50 pl-3 py-1">
                {zmanimEvents.filter(ev => {
                  const match = ev.time.match(/^(\d+):(\d+)\s(AM|PM)$/);
                  if (!match) return false;
                  let h = parseInt(match[1]);
                  const ampm = match[3];
                  if (ampm === 'PM' && h !== 12) h += 12;
                  if (ampm === 'AM' && h === 12) h = 0;
                  return h === hour;
                }).map((ev) => (
                  <div key={ev.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-body ${ev.color} mb-1`}>
                    <ev.icon className="h-3.5 w-3.5" />
                    <span className="font-medium">{ev.label}</span>
                    <span className="ml-auto text-xs opacity-80">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel with zmanim */}
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Daily Zmanim</h3>
          <div className="space-y-3">
            {zmanimEvents.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-body">{item.label.split(' (')[0]}</span>
                </div>
                <span className="text-sm font-semibold font-body tabular-nums">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {friday && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-accent" />
              <h3 className="font-heading font-semibold text-accent">Shabbat Shalom!</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Light Shabbat candles at <strong className="text-foreground">{zmanim.candleLighting}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}