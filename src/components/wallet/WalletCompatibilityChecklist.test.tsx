import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { WalletCompatibilityChecklist } from "@/components/wallet/WalletCompatibilityChecklist";
import { getSupportedWallets } from "@/util/wallet";

vi.mock("@/util/wallet", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/util/wallet")>();
  return { ...actual, getSupportedWallets: vi.fn() };
});

describe("WalletCompatibilityChecklist – #687", () => {
  it("marks available and missing wallets", () => {
    renderWithProviders(
      <WalletCompatibilityChecklist
        wallets={[
          { id: "freighter", name: "Freighter", isAvailable: true },
          { id: "albedo", name: "Albedo", isAvailable: false },
          { id: "xbull", name: "xBull", isAvailable: false },
        ]}
      />,
    );
    expect(screen.getByTestId("wallet-compatibility-checklist")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-compat-freighter")).toHaveTextContent(/available/i);
    expect(screen.getByTestId("wallet-compat-albedo")).toHaveTextContent(/not detected/i);
    expect(screen.getByTestId("wallet-compat-xbull")).toHaveTextContent(/not detected/i);
  });

  it("shows a loading state while detecting", () => {
    vi.mocked(getSupportedWallets).mockImplementation(
      () => new Promise(() => {}),
    );
    renderWithProviders(<WalletCompatibilityChecklist isLoading />);
    expect(screen.getByText(/checking installed wallets/i)).toBeInTheDocument();
  });
});
