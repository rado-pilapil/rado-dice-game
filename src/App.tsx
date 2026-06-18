import { useEffect, useState } from "react";

import PhaserGame from "./components/PhaserGame";

import ControlPanel from "./components/ControlPanel";

import { gameEvents, BridgeEvents } from "./game/bridge/events";

import { useDiceGame } from "./hooks/useDiceGame";

import LoadingOverlay from "@components/LoadingOverlay";

function App() {
  const [ready, setReady] = useState(false);

  const [error, setError] = useState(false);

  const game = useDiceGame();
  const {
    target,
    setTarget,
    rolling,
    result,
    history,
    streak,
    roll,
    muted,
    toggleMute,
    isWin,
    resetResultsVals,
    handleRollComplete,
  } = game || {};

  useEffect(() => {
    const handler = (value: number) => {
      handleRollComplete(value);
    };

    gameEvents.on(BridgeEvents.ROLL_COMPLETE, handler);

    return () => {
      gameEvents.off(BridgeEvents.ROLL_COMPLETE, handler);
    };
  }, [game]);

  useEffect(() => {
    gameEvents.on(BridgeEvents.READY, () => setReady(true));

    const keyHandler = (e: KeyboardEvent) => {
      if (target === "" || target === "0") return;

      if (e.code === "Space") {
        roll();
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [target]);

  useEffect(() => {
    gameEvents.on(BridgeEvents.READY, () => setReady(true));
  }, []);

  if (error) return <div>Failed to load game</div>;

  return (
    <div className="container">
      {!ready && <LoadingOverlay />}

      <div className="game">
        <PhaserGame onError={() => setError(true)} />
      </div>

      <div className="panel">
        <ControlPanel
          target={target}
          setTarget={setTarget}
          rolling={rolling}
          result={result}
          history={history}
          streak={streak}
          onRoll={roll}
          muted={muted}
          toggleMute={toggleMute}
          isWin={isWin}
          resetResultsVals={resetResultsVals}
        />
      </div>
    </div>
  );
}

export default App;
