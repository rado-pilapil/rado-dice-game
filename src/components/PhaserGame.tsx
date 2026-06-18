import { useEffect, useRef } from "react";
import { createGame } from "../game/createGame";

interface Props {
  onError: () => void;
}

export default function PhaserGame({ onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let game: any;

    try {
      game = createGame(containerRef.current);
    } catch {
      onError();
    }

    return () => {
      game?.destroy(true);
    };
  }, []);

  return <div className="phaser-wrapper" ref={containerRef} />;
}
