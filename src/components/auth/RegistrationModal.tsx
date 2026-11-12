import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { SierraLeoneFlag } from '../brand/SierraLeoneFlag';
import { Clock, AlertTriangle, ShieldCheck, Mail, ArrowRight, Eye, EyeOff, Camera, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenEmailDrawer?: () => void;
  insertedOtp?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenEmailDrawer,
  insertedOtp,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');

  // 15-Second OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);

  // Auto-fill insertedOtp from EmailDrawer if user clicked "Insert Code"
  useEffect(() => {
    if (insertedOtp && step === 2) {
      const digits = insertedOtp.slice(0, 6).split('');
      while (digits.length < 6) digits.push('');
      setOtpDigits(digits);
    }
  }, [insertedOtp, step]);

  // Strict 15-second interval timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, timeLeft]);

  if (!isOpen) return null;

  // Handle Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Profile image must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // STEP 1: Submit Details & Request 15-Second OTP
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register-step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          email,
          password,
          profilePicture: profilePicture || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit registration details.');
      }

      setTimeLeft(15);
      setStep(2);
      setPreviewOtp(data.previewCodeForDev || null);
      setInfoMessage('A 6-digit verification code has been dispatched to your email. Expires strictly in 15 seconds!');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Input Handler
  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Pasting full 6-digit code
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      const nextInput = document.getElementById('otp-digit-5');
      nextInput?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto advance focus
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  // STEP 2: Verify 6-digit code with strict 15-second enforcement
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict 15-second enforcement on client
    if (timeLeft <= 0) {
      setErrorMessage('The 15-second validation window has expired. You must request a new code.');
      return;
    }

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register-step2-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          email,
          password,
          profilePicture: profilePicture || null,
          otpCode: fullCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed.');
      }

      // Celebrate success!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Code may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend 15-Second Code
  const handleResendCode = async () => {
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request new code.');
      }

      setTimeLeft(15);
      setPreviewOtp(data.previewCodeForDev || null);
      setInfoMessage('New 6-digit code dispatched to your email! Fresh 15-second timer active.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl border-t-8 border-[#1EB53A] animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <SierraLeoneFlag className="h-4 w-6" />
            <div>
              <h2 className="text-base md:text-lg font-bold text-[#10243A]">
                {step === 1 ? 'National Scholar Registration' : 'Strict 15-Second OTP Verification'}
              </h2>
              <p className="text-[11px] text-slate-500">Sierra Leone National Research &amp; Innovation Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg text-2xl font-bold leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Step Indicator */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-600 border-b border-slate-100 pb-3">
          <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#0072C6] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 text-[11px]">1</span>
            Personal &amp; Profile Details
          </span>
          <ArrowRight className="h-3 w-3 text-slate-300" />
          <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#1EB53A] font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 text-[11px]">2</span>
            6-Digit Email Verification
          </span>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-[#0072C6] border border-blue-200">
            <Mail className="h-4 w-4 text-[#0072C6] flex-shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Live Delivery Preview Box for Seamless Testing */}
        {previewOtp && step === 2 && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Direct Email Dispatch Monitor
              </span>
              <span className="text-slate-700">Code delivered to <span className="font-semibold">{email}</span>: </span>
              <span className="font-mono font-extrabold text-[#0072C6] text-sm tracking-wider ml-1">{previewOtp}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const digits = previewOtp.split('');
                setOtpDigits(digits);
              }}
              className="px-2.5 py-1 bg-[#0072C6] text-white rounded text-xs font-bold hover:bg-[#005a9e] transition"
            >
              Autofill Code
            </button>
          </div>
        )}

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Andrew"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sesay"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth (DOB) *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Picture (Optional)</label>
                <div className="flex items-center gap-2">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#1EB53A]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border">
                      <Camera className="h-4 w-4" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:py-1.5 file:px-2.5 file:text-xs file:font-semibold hover:file:bg-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="scholar@university.edu.sl"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Your 6-digit verification code will be dispatched directly to this address.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
              disabled={isSubmitting}
              className="mt-4 w-full rounded-xl bg-[#0072C6] py-3 text-sm font-bold text-white shadow-md hover:bg-[#005a9e] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Dispatching 6-Digit Code...</span>
                </>
              ) : (
                <>
                  <span>Proceed to 15-Second Email Verification</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Strict 15-Second OTP Enforcement */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-5 text-center">
            {/* 15-Second Gauge */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Clock className="h-4 w-4 text-[#0072C6]" />
                <span>Strict Security Validity Window</span>
              </div>

              {/* Numerical timer */}
              <div
                className={`font-mono text-4xl font-extrabold mt-1 tracking-wider ${
                  timeLeft > 5 ? 'text-[#1EB53A]' : timeLeft > 0 ? 'text-amber-500 animate-pulse' : 'text-red-600'
                }`}
              >
                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft > 5 ? 'bg-[#1EB53A]' : timeLeft > 0 ? 'bg-amber-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                />
              </div>

              {timeLeft === 0 ? (
                <div className="mt-3 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                  ⛔ Time Expired (exceeded 15s). Input is locked. You must request a new code.
                </div>
              ) : (
                <p className="mt-2 text-[11px] text-slate-500">
                  Enter the 6-digit activation key sent to <span className="font-semibold text-slate-800">{email}</span> within 15s.
                </p>
              )}
            </div>

            {/* 6-Digit Input Boxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Input 6-Digit Code</label>
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    disabled={timeLeft === 0 || isSubmitting}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 md:w-12 md:h-14 text-center font-mono text-2xl font-extrabold rounded-lg border-2 border-slate-300 focus:border-[#0072C6] focus:bg-blue-50/30 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400 transition"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={timeLeft === 0 || isSubmitting || otpDigits.join('').length !== 6}
              className="w-full rounded-xl bg-[#1EB53A] py-3 text-sm font-bold text-white shadow-md hover:bg-[#16962e] transition disabled:opacity-40"
            >
              {isSubmitting ? 'Verifying Code...' : 'Activate National Scholar Account'}
            </button>

            {/* Resend button */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                className="text-xs font-bold text-[#0072C6] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Request a New 15-Second Code</span>
              </button>

              {onOpenEmailDrawer && (
                <button
                  type="button"
                  onClick={onOpenEmailDrawer}
                  className="text-[11px] text-slate-500 hover:text-slate-700 underline"
                >
                  View Outgoing Mail Delivery Monitor
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
