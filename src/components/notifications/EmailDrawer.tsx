import React, { useEffect, useState } from 'react';
import { DispatchedEmail } from '../../types';
import { Mail, X, Check, Clock, RefreshCw, Key, ShieldCheck } from 'lucide-react';

interface EmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyOtp?: (code: string) => void;
}

export const EmailDrawer: React.FC<EmailDrawerProps> = ({ isOpen, onClose, onCopyOtp }) => {
  const [emails, setEmails] = useState<DispatchedEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails/recent');
      const data = await res.json();
      if (data.success && Array.isArray(data.emails)) {
        setEmails(data.emails);
      }
    } catch (err) {
      console.warn('Failed to fetch recent emails:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmails();
      const interval = setInterval(fetchEmails, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#10243A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#1EB53A]" />
            <div>
              <h3 className="font-bold text-sm">SLNRIP Mail Delivery Monitor</h3>
              <p className="text-[11px] text-slate-300">Live feed of 6-digit OTPs &amp; Password Recoveries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmails}
              disabled={loading}
              className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {emails.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500">
              <Mail className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No emails dispatched yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Register an account or request a password reset to see outgoing emails live here.
              </p>
            </div>
          ) : (
            emails.map((email) => {
              const isOtp = email.type === 'registration_otp';
              const code = email.previewData?.code;
              const tempPass = email.previewData?.tempPassword;

              return (
                <div
                  key={email.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2 hover:border-[#0072C6]/40 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase ${
                        isOtp ? 'bg-emerald-50 text-[#1EB53A]' : 'bg-blue-50 text-[#0072C6]'
                      }`}
                    >
                      {isOtp ? '6-Digit OTP (15s Window)' : 'Password Reset'}
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {new Date(email.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 truncate">{email.subject}</h4>
                  <p className="text-xs text-slate-500">To: <span className="font-semibold text-slate-800">{email.to}</span></p>

                  {/* Highlights */}
                  {code && (
                    <div className="bg-slate-100 rounded-lg p-2.5 flex items-center justify-between border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">
                          Activation Code (Expires in 15s)
                        </span>
                        <span className="font-mono text-xl font-extrabold text-[#0072C6] tracking-widest">
                          {code}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(code);
                          if (onCopyOtp) onCopyOtp(code);
                          setCopiedId(email.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-[#0072C6] text-white rounded text-xs font-bold hover:bg-[#005a9e] transition flex items-center gap-1"
                      >
                        {copiedId === email.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <span>Insert Code</span>
                        )}
                      </button>
                    </div>
                  )}

                  {tempPass && (
                    <div className="bg-slate-100 rounded-lg p-2.5 flex items-center justify-between border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">
                          New Temporary Password
                        </span>
                        <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                          {tempPass}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(tempPass);
                          setCopiedId(email.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="px-2.5 py-1 bg-slate-800 text-white rounded text-xs font-bold hover:bg-slate-700 transition"
                      >
                        {copiedId === email.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-[11px] text-slate-500">
          Emails are actively dispatched to recipients and logged in this monitor.
        </div>
      </div>
    </div>
  );
};
