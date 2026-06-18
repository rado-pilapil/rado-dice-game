import { describe, expect, it, vi } from "vitest";

import { gameEvents, BridgeEvents } from "../game/bridge/events";

describe("Bridge Events", () => {
  it("fires roll request", () => {
    const spy = vi.fn();

    gameEvents.once(BridgeEvents.ROLL_REQUEST, spy);

    gameEvents.emit(BridgeEvents.ROLL_REQUEST, 99);

    expect(spy).toHaveBeenCalledWith(99);
  });
});
