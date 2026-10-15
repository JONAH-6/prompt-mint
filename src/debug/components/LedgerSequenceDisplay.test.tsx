import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { LedgerSequenceDisplay } from "./LedgerSequenceDisplay";

describe("LedgerSequenceDisplay – #688", () => {
  it("renders the ledger sequence number", () => {
    renderWithProviders(
      <LedgerSequenceDisplay rpcUrl="http://localhost:8000/rpc" ledger={12345} />,
    );
    expect(screen.getByTestId("ledger-sequence-number")).toHaveTextContent(
      "Ledger #12345",
    );
  });

  it("renders a loading state", () => {
    renderWithProviders(
      <LedgerSequenceDisplay rpcUrl="http://localhost:8000/rpc" isLoading />,
    );
    expect(screen.getByTestId("ledger-sequence-number")).toHaveTextContent(
      /loading/i,
    );
  });

  it("renders an unavailable state on error", () => {
    renderWithProviders(
      <LedgerSequenceDisplay
        rpcUrl="http://localhost:8000/rpc"
        ledger={null}
        error="Ledger unavailable"
      />,
    );
    expect(screen.getByTestId("ledger-sequence-number")).toHaveTextContent(
      "Ledger unavailable",
    );
  });
});
