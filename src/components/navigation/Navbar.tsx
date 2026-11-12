import React from 'react';
import { SLNRIPLogo } from '../brand/SLNRIPLogo';
import { SierraLeoneFlag } from '../brand/SierraLeoneFlag';
import { UserProfile } from '../../types';
import { ShieldCheck, Mail, LogOut, User, Menu, X, FileText, Award, BookOpen, Compass } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void;
  onOpenEmailDrawer: () => void;
  onLogout: () => void;
  isSuperadmin: boolean;
  onSuperadminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onOpenForgot,
  onOpenEmailDrawer,
  onLogout,
  isSuperadmin,
  onSuperadminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About SLNRIP' },
    { id: 'library', label: 'Research Library' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'evaluator', label: 'Evaluator Portal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Official National Banner */}
      <div className="bg-[#10243A] text-white text-[11px] py-1.5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <SierraLeoneFlag className="h-3.5 w-5" />
            <span className="font-semibold tracking-wide truncate">
              Republic of Sierra Leone • Ministry of Technical and Higher Education Initiative
            </span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Live Mail Monitor button */}
            <button
              onClick={onOpenEmailDrawer}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-slate-200 hover:text-white transition"
              title="View live dispatched emails (OTPs, password resets)"
            >
              <Mail className="h-3 w-3 text-[#1EB53A]" />
              <span>Mail Delivery Monitor</span>
            </button>

            {/* Restricted Backend gateway shortcut */}
            <button
              onClick={() => onNavigate('backend')}
              className={`flex items-center gap-1 font-bold text-[11px] transition ${
                currentView === 'backend' ? 'text-amber-300 underline' : 'text-[#1EB53A] hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isSuperadmin ? 'Superadmin Active' : 'Restricted Backend Gateway'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="focus:outline-none flex items-center"
        >
          <SLNRIPLogo className="h-10 md:h-12" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs md:text-sm font-semibold text-[#10243A]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`transition pb-1 border-b-2 ${
                currentView === link.id
                  ? 'border-[#0072C6] text-[#0072C6] font-bold'
                  : 'border-transparent text-slate-700 hover:text-[#0072C6]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => onNavigate('student')}
              className={`transition pb-1 border-b-2 ${
                currentView === 'student'
                  ? 'border-[#1EB53A] text-[#1EB53A] font-bold'
                  : 'border-transparent text-slate-700 hover:text-[#1EB53A]'
              }`}
            >
              Scholar Dashboard
            </button>
          )}
        </nav>

        {/* Right CTA / User Session Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {isSuperadmin && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#1EB53A] animate-ping" />
              <span>sesayandrewedusl</span>
              <button
                onClick={onSuperadminLogout}
                className="text-xs text-red-600 hover:underline ml-1 font-semibold"
                title="Disconnect Superadmin"
              >
                Log Out
              </button>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('student')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold text-[#10243A] transition"
              >
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.firstName}
                    className="w-5 h-5 rounded-full object-cover border border-[#0072C6]"
                  />
                ) : (
                  <User className="h-3.5 w-3.5 text-[#0072C6]" />
                )}
                <span>{currentUser.firstName}</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">({currentUser.userCode})</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            !isSuperadmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenForgot}
                  className="text-xs text-slate-600 hover:text-[#0072C6] font-semibold px-2 py-1"
                >
                  Forgot Password?
                </button>
                <button
                  onClick={onOpenLogin}
                  className="rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-[#10243A] hover:bg-slate-50 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenRegister}
                  className="rounded-xl bg-[#0072C6] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#005a9e] transition"
                >
                  Join SLNRIP (15s OTP)
                </button>
              </div>
            )
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 text-slate-700 hover:text-black rounded-lg"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                  currentView === link.id
                    ? 'bg-blue-50 text-[#0072C6] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  onNavigate('student');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg text-sm font-bold text-[#1EB53A] bg-emerald-50"
              >
                Scholar Dashboard ({currentUser.userCode})
              </button>
            )}
            <button
              onClick={() => {
                onNavigate('backend');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-bold text-[#10243A] bg-slate-100 flex items-center justify-between"
            >
              <span>Ministry Superadmin Gateway</span>
              <ShieldCheck className="h-4 w-4 text-[#1EB53A]" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentUser && (
              <>
                <button
                  onClick={() => {
                    onOpenRegister();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0072C6] text-white text-xs font-bold text-center"
                >
                  Create Account (15s OTP)
                </button>
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl border border-slate-300 text-[#10243A] text-xs font-bold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenForgot();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center text-xs text-slate-500 py-1"
                >
                  Forgot Password?
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
