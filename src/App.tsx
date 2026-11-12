import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { SLNRIPLogo } from './components/brand/SLNRIPLogo';
import { SierraLeoneFlag } from './components/brand/SierraLeoneFlag';
import { RegistrationModal } from './components/auth/RegistrationModal';
import { LoginModal } from './components/auth/LoginModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { EmailDrawer } from './components/notifications/EmailDrawer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { ResearchLibrary } from './pages/ResearchLibrary';
import { Competitions } from './pages/Competitions';
import { StudentDashboard } from './pages/StudentDashboard';
import { EvaluatorDashboard } from './pages/EvaluatorDashboard';
import { BackendSuperAdmin } from './pages/BackendSuperAdmin';
import { UserProfile } from './types';
import { ShieldCheck, Mail, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  // Current Navigation View
  const [currentView, setCurrentView] = useState<string>('home');

  // Active User Session (Student / Researcher)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('slnrip_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Superadmin State (sesayandrewedusl / neymarjrsl)
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(() => {
    return localStorage.getItem('slnrip_superadmin_token') !== null;
  });

  // Modal Open States
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);
  const [insertedOtp, setInsertedOtp] = useState<string>('');

  // Handle URL hash routing if present (e.g. #backend)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'backend') {
      setCurrentView('backend');
    } else if (['home', 'about', 'library', 'competitions', 'student', 'evaluator'].includes(hash)) {
      setCurrentView(hash);
    }
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('slnrip_active_user', JSON.stringify(user));
    setCurrentView('student');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('slnrip_active_user', JSON.stringify(user));
    setCurrentView('student');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('slnrip_active_user');
    setCurrentView('home');
  };

  const handleSuperadminLogin = (token: string) => {
    localStorage.setItem('slnrip_superadmin_token', token);
    setIsSuperadmin(true);
    setCurrentView('backend');
  };

  const handleSuperadminLogout = () => {
    localStorage.removeItem('slnrip_superadmin_token');
    setIsSuperadmin(false);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 antialiased">
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegModalOpen(true)}
        onOpenForgot={() => setForgotModalOpen(true)}
        onOpenEmailDrawer={() => setEmailDrawerOpen(true)}
        onLogout={handleLogout}
        isSuperadmin={isSuperadmin}
        onSuperadminLogout={handleSuperadminLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            onOpenRegister={() => setRegModalOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <About onNavigate={handleNavigate} />
        )}

        {currentView === 'library' && (
          <ResearchLibrary />
        )}

        {currentView === 'competitions' && (
          <Competitions
            onOpenRegister={() => setRegModalOpen(true)}
            currentUser={currentUser}
          />
        )}

        {currentView === 'student' && (
          currentUser ? (
            <StudentDashboard user={currentUser} />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <ShieldCheck className="h-12 w-12 text-[#0072C6] mx-auto" />
              <h2 className="text-xl font-bold text-[#10243A]">Scholar Authentication Required</h2>
              <p className="text-xs text-slate-600">
                Please create a verified account (with 15-second OTP) or sign in to access your scholar dashboard.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setRegModalOpen(true)}
                  className="px-4 py-2 bg-[#1EB53A] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Create Account (15s OTP)
                </button>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-4 py-2 border border-slate-300 text-xs font-bold rounded-xl"
                >
                  Sign In
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'evaluator' && (
          <EvaluatorDashboard />
        )}

        {currentView === 'backend' && (
          <BackendSuperAdmin
            isSuperadmin={isSuperadmin}
            onSuperadminLogin={handleSuperadminLogin}
            onSuperadminLogout={handleSuperadminLogout}
          />
        )}
      </main>

      {/* Modals */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
        onOpenEmailDrawer={() => setEmailDrawerOpen(true)}
        insertedOtp={insertedOtp}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onOpenRegister={() => setRegModalOpen(true)}
        onOpenForgot={() => setForgotModalOpen(true)}
        onOpenSuperadmin={() => handleNavigate('backend')}
      />

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        onOpenEmailDrawer={() => setEmailDrawerOpen(true)}
      />

      <EmailDrawer
        isOpen={emailDrawerOpen}
        onClose={() => setEmailDrawerOpen(false)}
        onCopyOtp={(code) => {
          setInsertedOtp(code);
          setEmailDrawerOpen(false);
          setRegModalOpen(true);
        }}
      />

      {/* Global Footer */}
      <footer className="bg-[#10243A] text-white py-12 px-4 md:px-8 border-t-4 border-[#1EB53A]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <SLNRIPLogo className="h-11" variant="dark" />

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <button onClick={() => handleNavigate('home')} className="hover:text-white transition">Home</button>
              <button onClick={() => handleNavigate('about')} className="hover:text-white transition">About SLNRIP</button>
              <button onClick={() => handleNavigate('library')} className="hover:text-white transition">Research Library</button>
              <button onClick={() => handleNavigate('competitions')} className="hover:text-white transition">Competitions</button>
              <button onClick={() => handleNavigate('backend')} className="hover:text-white font-bold text-[#1EB53A]">
                Ministry Backend Gateway
              </button>
            </div>

            <div className="flex items-center gap-2">
              <SierraLeoneFlag className="h-4 w-6" />
              <span className="text-xs text-slate-300 font-semibold">Republic of Sierra Leone</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              An independent national digital platform initiative founded and developed by{' '}
              <strong className="text-white">Andrew Sesay</strong>.
            </p>
            <p className="text-[11px] text-slate-500">
              SLNRIP • Secure 15-Second OTP Authentication • Ministry of Technical and Higher Education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
