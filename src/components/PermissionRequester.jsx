import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Bell } from "lucide-react";

export default function PermissionRequester() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasAskedPermissions = localStorage.getItem("jcal_permissions_asked");
    if (!hasAskedPermissions) {
      setShowModal(true);
    }
  }, []);

  const handleRequestPermissions = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {},
          () => {}
        );
      }

      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }

    localStorage.setItem("jcal_permissions_asked", "true");
    setShowModal(false);
  };

  const handleSkip = () => {
    localStorage.setItem("jcal_permissions_asked", "true");
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-lg shadow-2xl p-6 max-w-sm mx-4">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Enable App Features
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-body font-medium text-foreground">
                Location Access
              </p>
              <p className="text-xs text-muted-foreground font-body">
                For accurate prayer times and weather
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-body font-medium text-foreground">
                Notifications
              </p>
              <p className="text-xs text-muted-foreground font-body">
                For daily weather and Hebrew date alerts
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 font-body"
          >
            Skip
          </Button>
          <Button
            onClick={handleRequestPermissions}
            className="flex-1 font-body"
          >
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}