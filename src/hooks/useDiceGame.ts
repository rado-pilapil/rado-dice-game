import { useState, useCallback, useRef } from "react";

import { gameEvents, BridgeEvents } from "../game/bridge/events";

import { GAME_CONSTANTS } from "@constants/Constants";

export function useDiceGame() {
  const [target, setTarget] = useState<string>("");

  const [rolling, setRolling] = useState(false);

  const [result, setResult] = useState<number | null>(null);

  const [history, setHistory] = useState<number[]>([]);

  const [streak, setStreak] = useState(0);

  const [muted, setMuted] = useState(false);

  const [isWin, setIsWin] = useState(false);

  const lastRollRef = useRef<number | null>(null);

  const roll = () => {
    if (rolling) return;

    const randomResult =
      Math.floor(Math.random() * GAME_CONSTANTS.DICE_MAX_VALUE) + 1;

    setRolling(true);

    gameEvents.emit(BridgeEvents.ROLL_REQUEST, randomResult);
  };

  const toggleMute = () => {
    const newMuted = !muted;

    setMuted(newMuted);

    gameEvents.emit(BridgeEvents.SET_MUTE, newMuted);
  };

  const handleRollComplete = useCallback(
    (value: number) => {
      if (lastRollRef.current === value) return;

      lastRollRef.current = value;

      setRolling(false);
      setResult(value);

      setHistory((prev) => [
        value,
        ...prev.slice(0, GAME_CONSTANTS.MAX_HISTORY_ITEMS - 1),
      ]);

      setIsWin(value >= Number(target));

      setStreak((prev) => (value >= Number(target) ? prev + 1 : 0));
    },
    [target],
  );

  const resetResultsVals = useCallback(() => {
    setResult(null);
    setStreak(0);
    setHistory([]);
    setRolling(false);

    lastRollRef.current = null;
  }, []);

  return {
    target,
    setTarget,
    result,
    rolling,
    history,
    streak,
    muted,
    roll,
    toggleMute,
    isWin,
    handleRollComplete,
    resetResultsVals,
  };
}
