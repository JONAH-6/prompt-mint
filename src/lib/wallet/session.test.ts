import { describe, it, expect } from "vitest";
import {
  WALLET_SESSION_TTL_MS,
  formatSessionRemaining,
  getSessionExpiresAt,
  getSessionRemainingMs,
} from "./session";
import { toCompatibilityList } from "./compatibility";

describe("wallet session helpers", () => {
  it("derives expiry from connected-at plus TTL", () => {
    expect(getSessionExpiresAt(1000, 5000)).toBe(6000);
    expect(getSessionExpiresAt(1000)).toBe(1000 + WALLET_SESSION_TTL_MS);
  });

  it("clamps remaining time at zero", () => {
    expect(getSessionRemainingMs(2000, 1000)).toBe(1000);
    expect(getSessionRemainingMs(1000, 2000)).toBe(0);
  });

  it("formats mm:ss and h:mm:ss", () => {
    expect(formatSessionRemaining(0)).toBe("Expired");
    expect(formatSessionRemaining(5 * 60 * 1000)).toBe("5:00");
    expect(formatSessionRemaining(65 * 60 * 1000)).toBe("1:05:00");
  });
});

describe("wallet compatibility helpers", () => {
  it("maps kit detection onto the known wallet list", () => {
    const list = toCompatibilityList([
      { id: "freighter", isAvailable: true },
      { id: "albedo", isAvailable: false },
    ]);
    expect(list).toEqual([
      { id: "freighter", name: "Freighter", isAvailable: true },
      { id: "albedo", name: "Albedo", isAvailable: false },
      { id: "xbull", name: "xBull", isAvailable: false },
    ]);
  });
});
