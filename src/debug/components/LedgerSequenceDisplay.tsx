import { NetworkHeaders } from "../types/types";
import { useLedgerSequence } from "../hooks/useLedgerSequence";

interface LedgerSequenceDisplayProps {
  rpcUrl: string;
  headers?: NetworkHeaders;
  /** Overrides the live RPC value. Used by tests and stories. */
  ledger?: number | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Live ledger sequence number display for the debugger.
 * Shows the current network ledger so simulate/submit calls can be
 * correlated with `TransactionSuccessCard` result ledgers.
 */
export const LedgerSequenceDisplay = ({
  rpcUrl,
  headers,
  ledger: ledgerOverride,
  isLoading: loadingOverride,
  error: errorOverride,
  className = "",
}: LedgerSequenceDisplayProps) => {
  const query = useLedgerSequence({
    rpcUrl,
    headers,
    enabled: ledgerOverride === undefined,
    refetchInterval: 15000,
  });

  const ledger = ledgerOverride !== undefined ? ledgerOverride : query.data;
  const isLoading =
    loadingOverride !== undefined ? loadingOverride : query.isLoading;
  const error =
    errorOverride !== undefined
      ? errorOverride
      : query.isError
        ? "Ledger unavailable"
        : null;

  return (
    <div
      data-testid="ledger-sequence-number"
      className={className}
      aria-live="polite"
    >
      {isLoading ? (
        <span>Ledger: loading…</span>
      ) : error || ledger == null ? (
        <span>{error ?? "Ledger unavailable"}</span>
      ) : (
        <span>Ledger #{ledger}</span>
      )}
    </div>
  );
};
