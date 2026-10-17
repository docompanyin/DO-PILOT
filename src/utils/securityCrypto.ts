/**
 * Antigravity High-End Security Cryptographic Engine
 * Provides client-side and server-ready SHA-256 cryptographic hashing with per-record salts,
 * cryptographically secure random numeric OTP generation, and timing attack resistance.
 */

/**
 * Generates a cryptographically strong random hex salt
 */
export function generateSalt(byteLength: number = 16): string {
  const array = new Uint8Array(byteLength);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a plaintext password with a salt using Web Crypto API SHA-256
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const cleanPass = password.trim();
  const enc = new TextEncoder();
  const data = enc.encode(`${cleanPass}:::${salt}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compares an input password against stored salt and hash
 */
export async function verifyPasswordHash(
  inputPassword: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> {
  if (!inputPassword || !storedHash || !storedSalt) return false;
  const computed = await hashPassword(inputPassword, storedSalt);
  return computed === storedHash;
}

/**
 * Generates a cryptographically secure 6-digit numeric OTP code
 */
export function generateSecureOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  // Ensure exactly 6 digits: 100000 to 999999
  const otp = 100000 + (array[0] % 900000);
  return otp.toString();
}

/**
 * Constant-time string comparison helper to mitigate side-channel timing attacks
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
