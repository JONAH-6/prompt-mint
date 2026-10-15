import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getSupportedWallets } from "@/util/wallet";
import {
  KNOWN_WALLETS,
  toCompatibilityList,
  type WalletAvailability,
} from "@/lib/wallet/compatibility";

interface WalletCompatibilityChecklistProps {
  /** Overrides live kit detection. Used by tests and stories. */
  wallets?: WalletAvailability[];
  isLoading?: boolean;
  className?: string;
}

/**
 * Visual checklist of supported wallets and their install status.
 * Falls back to the static known list when detection is unavailable.
 */
export const WalletCompatibilityChecklist = ({
  wallets: walletsOverride,
  isLoading: loadingOverride,
  className = "",
}: WalletCompatibilityChecklistProps) => {
  const [detected, setDetected] = useState<WalletAvailability[]>(() =>
    walletsOverride ?? KNOWN_WALLETS.map((w) => ({ ...w, isAvailable: false })),
  );
  const [isLoading, setIsLoading] = useState(
    loadingOverride ?? walletsOverride === undefined,
  );

  useEffect(() => {
    if (walletsOverride !== undefined) {
      setDetected(walletsOverride);
      setIsLoading(loadingOverride ?? false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getSupportedWallets()
      .then((supported) => {
        if (!cancelled) setDetected(toCompatibilityList(supported));
      })
      .catch(() => {
        if (!cancelled)
          setDetected(
            KNOWN_WALLETS.map((w) => ({ ...w, isAvailable: false })),
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [walletsOverride, loadingOverride]);

  return (
    <div
      data-testid="wallet-compatibility-checklist"
      className={`rounded-xl border border-white/10 bg-white/5 p-4 text-left ${className}`}
    >
      <p className="text-sm font-semibold text-white">Wallet compatibility</p>
      {isLoading ? (
        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          Checking installed wallets…
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {detected.map((w) => (
            <li
              key={w.id}
              data-testid={`wallet-compat-${w.id}`}
              className="flex items-center gap-2 text-xs text-slate-300"
            >
              {w.isAvailable ? (
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-400"
                  aria-label={`${w.name} available`}
                />
              ) : (
                <XCircle
                  className="h-4 w-4 shrink-0 text-slate-500"
                  aria-label={`${w.name} not detected`}
                />
              )}
              <span className="font-medium text-slate-100">{w.name}</span>
              <span className="opacity-70">
                {w.isAvailable ? "Available" : "Not detected"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
