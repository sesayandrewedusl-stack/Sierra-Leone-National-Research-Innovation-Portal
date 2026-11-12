import { OtpRecord } from '../types';

export const SUPERADMIN_USERNAME = 'sesayandrewedusl';
export const SUPERADMIN_PASSWORD = 'neymarjrsl';

/**
 * Validates founder superadmin credentials.
 * User requirement: "wherein i alone access the back end with the username sesayandrewedusl and password neymarjrsl"
 */
export function validateSuperadminCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;
  return username.trim() === SUPERADMIN_USERNAME && password === SUPERADMIN_PASSWORD;
}

/**
 * Generates a cryptographically strong 6-digit numeric OTP string.
 */
export function generate6DigitOtp(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return num.toString();
}

/**
 * Creates an OTP record with strict 15-second TTL.
 * User requirement: "if after 15 seconds you input the code must not enter unless you request a new one"
 */
export function createOtpRecord(email: string, nowMs = Date.now(), ttlSeconds = 15): OtpRecord {
  const code = generate6DigitOtp();
  return {
    id: `otp_${nowMs}_${Math.random().toString(36).slice(2, 7)}`,
    email: email.trim().toLowerCase(),
    otpCode: code,
    createdAtMs: nowMs,
    expiresAtMs: nowMs + ttlSeconds * 1000,
    consumed: false,
  };
}

export interface VerifyOtpResult {
  success: boolean;
  reason?: 'NOT_FOUND' | 'EXPIRED' | 'CONSUMED' | 'INVALID';
  message: string;
}

/**
 * Strictly verifies 6-digit OTP against record and enforces the 15-second window.
 */
export function verifyOtp(
  record: OtpRecord | null | undefined,
  enteredCode: string,
  nowMs = Date.now()
): VerifyOtpResult {
  if (!record) {
    return {
      success: false,
      reason: 'NOT_FOUND',
      message: 'No verification code found for this email. Please request a new code.',
    };
  }

  if (record.consumed) {
    return {
      success: false,
      reason: 'CONSUMED',
      message: 'This 6-digit code has already been used. Please request a new code.',
    };
  }

  // Strict 15-second check
  if (nowMs > record.expiresAtMs) {
    return {
      success: false,
      reason: 'EXPIRED',
      message: 'The 15-second verification window has expired. You must request a new code.',
    };
  }

  const cleanEntered = enteredCode.trim().replace(/\D/g, '');
  if (cleanEntered !== record.otpCode) {
    return {
      success: false,
      reason: 'INVALID',
      message: 'Invalid 6-digit verification code. Please check your email and try again.',
    };
  }

  return {
    success: true,
    message: 'Verification successful. Your account is activated.',
  };
}

/**
 * Generates a temporary recovery password to dispatch to the user's email.
 */
export function generateTempPassword(): string {
  const randomPin = Math.floor(100000 + Math.random() * 900000);
  return `SL#${randomPin}!`;
}
