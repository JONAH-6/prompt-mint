import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { WalletSessionCountdown } from "@/components/wallet/WalletSessionCountdown";

describe("WalletSessionCountdown – #684", () => {
  it("renders nothing when wallet is not connected", () => {
    renderWithProviders(<WalletSessionCountdown expiresAt={Date.now() + 60000} />, {
      wallet: { status: "idle" },
    });
    expect(screen.queryByTestId("wallet-session-countdown")).not.toBeInTheDocument();
  });

  it("renders remaining session time in the header", () => {
    renderWithProviders(
      <WalletSessionCountdown expiresAt={Date.now() + 5 * 60 * 1000} />,
      { wallet: { status: "connected", sessionExpiresAt: Date.now() + 5 * 60 * 1000 } },
    );
    const pill = screen.getByTestId("wallet-session-countdown");
    expect(pill).toHaveTextContent(/session/i);
    expect(pill.title).toMatch(/expires in/i);
  });

  it("renders an expired state after the deadline", () => {
    renderWithProviders(
      <WalletSessionCountdown expiresAt={Date.now() - 1000} />,
      { wallet: { status: "connected" } },
    );
    expect(screen.getByTestId("wallet-session-countdown")).toHaveTextContent(
      /session expired/i,
    );
  });
});
