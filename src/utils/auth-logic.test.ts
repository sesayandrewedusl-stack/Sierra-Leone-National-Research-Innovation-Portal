import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSuperadminCredentials,
  createOtpRecord,
  verifyOtp,
  generate6DigitOtp,
  generateTempPassword,
  SUPERADMIN_USERNAME,
  SUPERADMIN_PASSWORD,
} from './auth-logic';

test('Superadmin gateway grants access solely to sesayandrewedusl with neymarjrsl', () => {
  assert.equal(validateSuperadminCredentials('sesayandrewedusl', 'neymarjrsl'), true);
  assert.equal(validateSuperadminCredentials(' sesayandrewedusl ', 'neymarjrsl'), true);
  assert.equal(validateSuperadminCredentials('admin', 'neymarjrsl'), false);
  assert.equal(validateSuperadminCredentials('sesayandrewedusl', 'wrongpassword'), false);
  assert.equal(validateSuperadminCredentials('', ''), false);
  assert.equal(SUPERADMIN_USERNAME, 'sesayandrewedusl');
  assert.equal(SUPERADMIN_PASSWORD, 'neymarjrsl');
});

test('generate6DigitOtp produces exactly 6 numeric digits', () => {
  for (let i = 0; i < 20; i++) {
    const otp = generate6DigitOtp();
    assert.equal(otp.length, 6);
    assert.match(otp, /^\d{6}$/);
  }
});

test('OTP verification succeeds within the 15-second window', () => {
  const baseTime = 1000000;
  const record = createOtpRecord('scholar@fbc.edu.sl', baseTime, 15);
  assert.equal(record.otpCode.length, 6);
  assert.equal(record.expiresAtMs, baseTime + 15000);

  // At 5 seconds:
  const resultAt5s = verifyOtp(record, record.otpCode, baseTime + 5000);
  assert.equal(resultAt5s.success, true);

  // At 14.999 seconds:
  const resultAt14s = verifyOtp(record, record.otpCode, baseTime + 14999);
  assert.equal(resultAt14s.success, true);
});

test('OTP verification strictly rejects submission after 15 seconds', () => {
  const baseTime = 1000000;
  const record = createOtpRecord('scholar@fbc.edu.sl', baseTime, 15);

  // At exactly 15.001 seconds (expired):
  const resultExpired = verifyOtp(record, record.otpCode, baseTime + 15001);
  assert.equal(resultExpired.success, false);
  assert.equal(resultExpired.reason, 'EXPIRED');
  assert.match(resultExpired.message, /expired/i);

  // At 25 seconds:
  const resultAt25s = verifyOtp(record, record.otpCode, baseTime + 25000);
  assert.equal(resultAt25s.success, false);
  assert.equal(resultAt25s.reason, 'EXPIRED');
});

test('OTP verification rejects incorrect code and consumed code', () => {
  const baseTime = 1000000;
  const record = createOtpRecord('scholar@fbc.edu.sl', baseTime, 15);

  // Wrong code
  const resultWrong = verifyOtp(record, '000000', baseTime + 2000);
  assert.equal(resultWrong.success, false);
  assert.equal(resultWrong.reason, 'INVALID');

  // Mark consumed
  record.consumed = true;
  const resultConsumed = verifyOtp(record, record.otpCode, baseTime + 2000);
  assert.equal(resultConsumed.success, false);
  assert.equal(resultConsumed.reason, 'CONSUMED');
});

test('generateTempPassword produces secure temporary password format', () => {
  const tempPass = generateTempPassword();
  assert.match(tempPass, /^SL#\d{6}!$/);
});
