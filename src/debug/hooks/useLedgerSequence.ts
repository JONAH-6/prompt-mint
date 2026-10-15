import { useQuery } from "@tanstack/react-query";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { NetworkHeaders } from "../types/types";
import { isEmptyObject } from "../util/isEmptyObject";

/**
 * Fetches the current ledger sequence number from Soroban RPC.
 * Used by the debugger header display. Disabled until callers opt in
 * so tests and idle pages never hit the network.
 */
export const useLedgerSequence = ({
  rpcUrl,
  headers,
  enabled = true,
  refetchInterval = 15000,
}: {
  rpcUrl: string;
  headers?: NetworkHeaders;
  enabled?: boolean;
  refetchInterval?: number | false;
}) => {
  return useQuery({
    queryKey: ["ledgerSequence", { rpcUrl }],
    queryFn: async (): Promise<number> => {
      const server = new StellarRpc.Server(rpcUrl, {
        headers:
          headers && !isEmptyObject(headers) ? { ...headers } : undefined,
        allowHttp: new URL(rpcUrl).hostname === "localhost",
      });
      const ledger = await server.getLatestLedger();
      return ledger.sequence;
    },
    enabled: enabled && !!rpcUrl,
    refetchInterval,
    retry: false,
    staleTime: 10000,
  });
};
