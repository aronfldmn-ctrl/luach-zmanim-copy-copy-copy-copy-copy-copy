import React, { useState, useEffect } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { useSettings, HEB_UI } from "@/lib/settingsContext";
import { fetchDafYomi } from "@/lib/dafYomi";

export default function DafYomiPanel({ date }) {
  const [dafYomi, setDafYomi] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hebrewMode } = useSettings();

  const t = (en, heb) => hebrewMode ? heb : en;

  useEffect(() => {
    setLoading(true);
    fetchDafYomi(date).then(data => {
      setDafYomi(data);
      setLoading(false);
    });
  }, [date.toDateString()]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!dafYomi) {
    return (
      <div className="text-center p-4 text-xs text-muted-foreground font-body">
        {t("No Daf Yomi available", "אין דף היומי זמין")}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
      <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">
          {t("Daf Yomi", HEB_UI.daf_yomi)}
        </p>
        <p className="text-sm font-body font-semibold text-primary truncate">
          {dafYomi.display}
        </p>
      </div>
    </div>
  );
}