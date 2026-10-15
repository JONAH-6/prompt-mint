import { ShieldCheck } from "lucide-react";

const PERMISSIONS = [
  {
    title: "View your public address",
    detail: "The app reads your Stellar public key to show balances and history.",
  },
  {
    title: "Request transaction signatures",
    detail: "Every payment or contract call needs your explicit approval in the wallet.",
  },
  {
    title: "Request message signatures",
    detail: "Login challenges are signed, never your secret key or recovery phrase.",
  },
  {
    title: "Read network information",
    detail: "Used to warn you when the wallet network differs from the app network.",
  },
];

/**
 * Explains what the wallet will be asked to approve before connecting.
 * Rendered inside the connect modal so users see it pre-authorization.
 */
export const WalletPermissionsPanel = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div
      data-testid="wallet-permissions-panel"
      className={`rounded-xl border border-white/10 bg-white/5 p-4 text-left ${className}`}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-semibold text-white">Wallet permissions</p>
      </div>
      <ul className="mt-2 space-y-2">
        {PERMISSIONS.map((p) => (
          <li key={p.title} className="text-xs text-slate-300">
            <span className="font-medium text-slate-100">{p.title}. </span>
            <span className="opacity-80">{p.detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-slate-400">
        PromptMint never requests your secret key or recovery phrase.
      </p>
    </div>
  );
};
