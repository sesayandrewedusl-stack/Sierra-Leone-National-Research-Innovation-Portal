import React, { useState } from 'react';
import { SierraLeoneFlag } from '../brand/SierraLeoneFlag';
import { KeyRound, Mail, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmailDrawer?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenEmailDrawer,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [previewPassword, setPreviewPassword] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setPreviewPassword(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to process request.');
      }

      setStatus({
        message: data.message || 'Your password has been sent to your email address.',
        isError: false,
      });

      if (data.previewPasswordForDev) {
        setPreviewPassword(data.previewPasswordForDev);
      }
    } catch (err: any) {
      setStatus({ message: err.message || 'Error occurred.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border-t-8 border-[#0072C6] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SierraLeoneFlag className="h-4 w-6" />
            <h3 className="font-bold text-base text-[#10243A]">Password Recovery</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none">
            &times;
          </button>
        </div>

        {status && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
              status.isError
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {status.isError ? (
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {previewPassword && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs">
            <span className="text-[10px] uppercase font-bold text-[#0072C6] block">
              Direct Mail Dispatch Monitor
            </span>
            <p className="text-slate-700 mt-1">
              Temporary password sent to <span className="font-semibold">{email}</span>:
            </p>
            <div className="font-mono text-base font-extrabold text-slate-900 mt-1 bg-white p-2 rounded border border-blue-200 text-center tracking-wider">
              {previewPassword}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your registered email address. Your login credentials will be dispatched directly to your inbox.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu.sl"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0072C6] py-3 text-sm font-bold text-white shadow-md hover:bg-[#005a9e] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Transmitting Credentials...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Password to Email</span>
              </>
            )}
          </button>

          {onOpenEmailDrawer && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onOpenEmailDrawer}
                className="text-[11px] text-[#0072C6] hover:underline font-semibold"
              >
                Inspect Outgoing Mail Delivery Monitor
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
