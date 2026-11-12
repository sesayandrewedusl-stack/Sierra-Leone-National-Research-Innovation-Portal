import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { SierraLeoneFlag } from '../brand/SierraLeoneFlag';
import { LogIn, AlertCircle, RefreshCw, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenRegister: () => void;
  onOpenForgot: () => void;
  onOpenSuperadmin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenRegister,
  onOpenForgot,
  onOpenSuperadmin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border-t-8 border-[#10243A] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SierraLeoneFlag className="h-4 w-6" />
            <h3 className="font-bold text-base text-[#10243A]">National Scholar Sign In</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none">
            &times;
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu.sl"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenForgot();
                }}
                className="text-[11px] font-semibold text-[#0072C6] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-300 p-2.5 pr-10 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#10243A] py-3 text-sm font-bold text-white shadow-md hover:bg-[#1a385a] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to Scholar Portal</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center space-y-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="font-bold text-[#0072C6] hover:underline"
              >
                Create Account (15s OTP)
              </button>
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSuperadmin();
              }}
              className="text-[11px] text-emerald-700 hover:underline font-semibold block mx-auto"
            >
              Ministry Superadmin Gateway &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
