import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './store/ThemeContext.jsx';
import { AuthProvider, AuthContext } from './store/AuthContext.jsx';
import { ChatProvider } from './store/ChatContext.jsx';
import './i18n.js';
import Navbar from './components/Navbar/Navbar.jsx';
import './styles/index.css';

/* Lazy-load pages for code splitting */
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ChatPage = lazy(() => import('./pages/ChatPage.jsx'));
const WalkthroughPage = lazy(() => import('./pages/WalkthroughPage.jsx'));
const TimelinePage = lazy(() => import('./pages/TimelinePage.jsx'));
const ScenariosPage = lazy(() => import('./pages/ScenariosPage.jsx'));
const PollingPage = lazy(() => import('./pages/PollingPage.jsx'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

/** Loading spinner shown during lazy load */
function PageLoader() {
  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        animation: 'fadeIn 0.3s ease',
      }}>
        <div className="animate-spin" style={{
          width: 40,
          height: 40,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
        }} />
        <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Loading...
        </span>
      </div>
    </div>
  );
}

/** App shell with Navbar */
function AppShell() {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Navbar user={user} onLogout={logout} />
      <div id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/walkthrough" element={<WalkthroughPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/polling" element={<PollingPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <AppShell />
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
