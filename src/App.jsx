import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { SettingsProvider } from '@/lib/settingsContext';
import OfflineIndicator from '@/components/OfflineIndicator';
import PermissionRequester from '@/components/PermissionRequester.jsx';
import { registerServiceWorker } from '@/lib/offline';
import Calendar from '@/pages/Calendar/index.jsx';
// Add page imports here

// Register Service Worker on app load
if (typeof window !== 'undefined') {
  registerServiceWorker();
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <OfflineIndicator />
      <PermissionRequester />
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/*" element={<Calendar />} />
      </Routes>
      <Toaster />
    </>
  );
};


function App() {

  return (
    <Router>
      <QueryClientProvider client={queryClientInstance}>
        <AuthProvider>
          <SettingsProvider>
            <AuthenticatedApp />
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  )
}

export default App