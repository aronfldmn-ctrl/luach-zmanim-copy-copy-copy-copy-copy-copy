import React, { useState } from 'react';
import { getHolidayDescription, getHolidayColorDynamic } from '@/lib/holidayUtils';
import { useSettings } from '@/lib/settingsContext';

export default function HolidayBadge({ holiday, compact = false }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { hebrewMode } = useSettings();
  
  const description = getHolidayDescription(holiday);
  const colors = getHolidayColorDynamic(holiday);

  if (compact) {
    return (
      <div className="relative inline-block">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-body font-medium rounded border ${colors.bg} ${colors.border} ${colors.text} truncate cursor-help`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onTouchStart={() => setShowTooltip(!showTooltip)}
        >
          {holiday}
        </span>
        {showTooltip && (
          <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-primary-foreground text-xs rounded-lg shadow-lg whitespace-nowrap">
            {description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block w-full">
      <div
        className={`px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(!showTooltip)}
      >
        <p className={`text-sm font-body font-semibold ${colors.text}`}>{holiday}</p>
        <p className={`text-xs font-body ${colors.text} opacity-80`}>{description}</p>
      </div>
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-primary-foreground text-xs rounded-lg shadow-lg">
          {description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
}