import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/lib/offline';

function OfflineContent() {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div className="fixed top-[env(safe-area-inset-top)] left-0 right-0 bg-destructive text-destructive-foreground px-4 py-2 flex items-center gap-2 text-xs font-body z-40">
      <WifiOff className="h-3.5 w-3.5 flex-shrink-0" />
      <span>Offline mode · Using cached data</span>
    </div>
  );
}

export default function OfflineIndicator() {
  return <OfflineContent />;
}