// OAuth return detection for "Sign in with Viktor".
//
// A successful authorize round trip lands back in the app with ?code=... in
// the URL; a denial lands without one. Convex Auth's provider consumes the
// code and strips it from the URL as soon as it mounts, and components can
// mount at any point relative to that — so both return signals are captured
// once at module-evaluation time (strictly before any component mounts or
// provider effect runs) and exposed as page-load constants.

export const OAUTH_CALLBACK_PATH = "/auth/callback";
// Query param the OAuth callback page sets when a sign-in attempt failed, so
// the login page shows an explanation only when explicitly told to.
export const VIKTOR_SIGN_IN_RESULT_PARAM = "viktor_sign_in";
export const VIKTOR_SIGN_IN_FAILED_VALUE = "failed";
export const LOGIN_FAILED_PATH = `/login?${VIKTOR_SIGN_IN_RESULT_PARAM}=${VIKTOR_SIGN_IN_FAILED_VALUE}`;

// Marks an in-flight Viktor OAuth round trip so a denied return (which
// carries no code) can be told apart from a stray direct visit.
const ATTEMPT_STORAGE_KEY = "viktor-spaces:viktor-signin-attempt";
const ATTEMPT_TTL_MS = 5 * 60 * 1000;

export function hasOAuthCodeInSearch(search: string): boolean {
  return new URLSearchParams(search).has("code");
}

export function markViktorSignInAttempt(): void {
  try {
    sessionStorage.setItem(ATTEMPT_STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable — a denied return will land on the plain login
    // page without the explanatory message.
  }
}

function consumeFreshAttemptMarker(): boolean {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (raw === null) return false;
    sessionStorage.removeItem(ATTEMPT_STORAGE_KEY);
    const startedAt = Number(raw);
    return (
      Number.isFinite(startedAt) && Date.now() - startedAt < ATTEMPT_TTL_MS
    );
  } catch {
    return false;
  }
}

const landedWithOAuthCode =
  typeof window !== "undefined" && hasOAuthCodeInSearch(window.location.search);

// Only the callback route is the return leg of an attempt, so the marker is
// consumed only there — a second tab or a stray /login visit while the OAuth
// round trip is in flight must not eat the marker and rob the real return of
// its denied-attempt context.
const returnedFromAttempt =
  typeof window !== "undefined" &&
  window.location.pathname === OAUTH_CALLBACK_PATH &&
  consumeFreshAttemptMarker();

/** Whether this page load arrived carrying an OAuth verification code. */
export function pageLoadHadOAuthCode(): boolean {
  return landedWithOAuthCode;
}

/** Whether this page load is the return leg of a recent sign-in attempt. */
export function pageLoadReturnedFromViktorSignIn(): boolean {
  return returnedFromAttempt;
}
