import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { WalletPermissionsPanel } from "@/components/wallet/WalletPermissionsPanel";

describe("WalletPermissionsPanel – #686", () => {
  it("explains the wallet permissions requested", () => {
    renderWithProviders(<WalletPermissionsPanel />);
    const panel = screen.getByTestId("wallet-permissions-panel");
    expect(panel).toHaveTextContent(/wallet permissions/i);
    expect(panel).toHaveTextContent(/view your public address/i);
    expect(panel).toHaveTextContent(/request transaction signatures/i);
    expect(panel).toHaveTextContent(/never requests your secret key/i);
  });
});
