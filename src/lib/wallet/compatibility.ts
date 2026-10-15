export interface KnownWallet {
  id: string;
  name: string;
}

export const KNOWN_WALLETS: KnownWallet[] = [
  { id: "freighter", name: "Freighter" },
  { id: "albedo", name: "Albedo" },
  { id: "xbull", name: "xBull" },
];

export interface WalletAvailability {
  id: string;
  name: string;
  isAvailable: boolean;
}

/**
 * Merge the static known-wallet list with kit detection results.
 * Unknown ids from the kit are ignored to keep the checklist stable.
 */
export function toCompatibilityList(
  supported: Array<{ id: string; isAvailable?: boolean }> | undefined,
): WalletAvailability[] {
  if (!supported) return KNOWN_WALLETS.map((w) => ({ ...w, isAvailable: false }));
  const byId = new Map(supported.map((w) => [w.id, !!w.isAvailable]));
  return KNOWN_WALLETS.map((w) => ({
    ...w,
    isAvailable: byId.get(w.id) ?? false,
  }));
}
