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

  // useEffect(() => {
  //   gameEvents.on(BridgeEvents.ROLL_COMPLETE, game.handleRollComplete);

  //   return () => {
  //     gameEvents.off(BridgeEvents.ROLL_COMPLETE, game.handleRollComplete);
  //   };
  // }, [game.handleRollComplete]);
  useEffect(() => {
    const handler = (value: number) => {
      // game.handleRollComplete(value);
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

  if (error) return <div>Failed to load game</div>;

  return (
    <div className="container">
      {/* {!ready && <div>Loading...</div>} */}
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
