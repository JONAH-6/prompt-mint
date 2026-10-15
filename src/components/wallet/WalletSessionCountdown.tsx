import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import {
  formatSessionRemaining,
  getSessionRemainingMs,
} from "@/lib/wallet/session";

interface WalletSessionCountdownProps {
  /** Overrides the wallet context expiry. Used by tests and stories. */
  expiresAt?: number;
  className?: string;
}

/**
 * Countdown pill for the header showing remaining wallet session time.
 * Renders nothing unless the wallet is connected with a known expiry.
 */
export const WalletSessionCountdown = ({
  expiresAt: expiresAtOverride,
  className = "",
}: WalletSessionCountdownProps) => {
  const { status, sessionExpiresAt } = useWallet();
  const expiresAt = expiresAtOverride ?? sessionExpiresAt;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "connected" || !expiresAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [status, expiresAt]);

  if (status !== "connected" || !expiresAt) return null;

  const remaining = getSessionRemainingMs(expiresAt, now);
  const isExpired = remaining <= 0;

  return (
    <div
      data-testid="wallet-session-countdown"
      title={
        isExpired
          ? "Wallet session expired"
          : `Wallet session expires in ${formatSessionRemaining(remaining)}`
      }
      className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs md:inline-flex ${
        isExpired
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-white/15 bg-white/10 text-slate-100"
      } ${className}`}
    >
      <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>
        {isExpired
          ? "Session expired"
          : `Session ${formatSessionRemaining(remaining)}`}
      </span>
    </div>
  );
};
