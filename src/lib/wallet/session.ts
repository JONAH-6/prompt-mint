/**
 * Wallet session expiry helpers.
 *
 * Sessions are persisted via `walletConnectedAt` in storage and surfaced
 * through `WalletProvider` as `sessionExpiresAt`. The countdown UI only
 * reads these values; it never extends the session on its own.
 */

export const WALLET_SESSION_TTL_MS = 30 * 60 * 1000;

export function getSessionExpiresAt(
  connectedAt: number,
  ttlMs: number = WALLET_SESSION_TTL_MS,
): number {
  return connectedAt + ttlMs;
}

export function getSessionRemainingMs(
  expiresAt: number,
  now: number = Date.now(),
): number {
  return Math.max(0, expiresAt - now);
}

export function formatSessionRemaining(remainingMs: number): string {
  if (remainingMs <= 0) return "Expired";
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}
