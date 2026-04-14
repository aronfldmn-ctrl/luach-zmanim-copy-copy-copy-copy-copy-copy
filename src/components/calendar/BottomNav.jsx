import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Rows, Square, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname.split("/").pop() || "month";

  const views = [
    { path: "/day", icon: Calendar, label: "Day", key: "day" },
    { path: "/week", icon: Rows, label: "Week", key: "week" },
    { path: "/month", icon: Square, label: "Month", key: "month" },
    { path: "/year", icon: Grid, label: "Year", key: "year" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around safe-area-inset-bottom h-16 md:hidden">
      {views.map(({ path, icon: Icon, label, key }) => (
        <button
          key={key}
          onClick={() => navigate(path)}
          className={cn(
            "flex flex-col items-center justify-center h-full flex-1 gap-1 transition-colors",
            currentView === key
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-body font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}