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
