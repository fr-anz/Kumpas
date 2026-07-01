/**
 * Offline Philippine mobile number validation + normalization.
 *
 * No network/API is used — this only checks that the number is well-formed,
 * which catches typos in an emergency contact. It intentionally does NOT do
 * SMS/OTP verification (that would require a paid backend service and break
 * the app's offline-first guarantee).
 *
 * Accepted inputs (spaces, dashes, parentheses ignored):
 *   09XXXXXXXXX      (11 digits, local format)
 *   +639XXXXXXXXX    (E.164)
 *   639XXXXXXXXX
 */

export type PhoneCheck = {
  valid: boolean;
  /** E.164 normalized form (+639XXXXXXXXX) when valid. */
  normalized: string;
};

export function validatePhilippineMobile(raw: string): PhoneCheck {
  const digits = raw.replace(/[\s\-()]/g, "");

  // Local: 09XXXXXXXXX
  let m = /^0(9\d{9})$/.exec(digits);
  if (m) return { valid: true, normalized: `+63${m[1]}` };

  // +639XXXXXXXXX
  m = /^\+63(9\d{9})$/.exec(digits);
  if (m) return { valid: true, normalized: `+63${m[1]}` };

  // 639XXXXXXXXX
  m = /^63(9\d{9})$/.exec(digits);
  if (m) return { valid: true, normalized: `+63${m[1]}` };

  return { valid: false, normalized: "" };
}

/** Format an E.164 PH mobile for display: +63 9XX XXX XXXX. */
export function formatPhilippineMobile(normalized: string): string {
  const m = /^\+63(9\d{2})(\d{3})(\d{4})$/.exec(normalized);
  if (!m) return normalized;
  return `+63 ${m[1]} ${m[2]} ${m[3]}`;
}

/**
 * Reduce any stored/raw value to the 10-digit national number (without the
 * +63 country code or a leading 0). Returns up to 10 digits.
 */
export function toNationalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("63")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Whether a 10-digit national number is a valid PH mobile (starts with 9). */
export function isValidNationalNumber(digits: string): boolean {
  return /^9\d{9}$/.test(digits);
}

/**
 * Display formatting for the national number field. Spacing (3-3-4) is only
 * applied once all 10 digits are present; otherwise the raw digits are shown.
 */
export function formatNationalInput(digits: string): string {
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return digits;
}
