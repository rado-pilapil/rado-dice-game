import { GAME_CONSTANTS } from "@constants/Constants";

interface Props {
  target: string;
  setTarget: (value: string) => void;
  rolling: boolean;
  result: number | null;
  history: number[];
  streak: number;
  onRoll: () => void;
  muted: boolean;
  toggleMute: () => void;
  isWin: boolean;
  resetResultsVals: () => void;
}

export default function ControlPanel({
  target,
  setTarget,
  rolling,
  result,
  history,
  streak,
  onRoll,
  muted,
  toggleMute,
  isWin,
  resetResultsVals,
}: Props) {
  const isValidTarget =
    target !== "" &&
    !Number.isNaN(Number(target)) &&
    Number(target) >= GAME_CONSTANTS.DICE_MIN_VALUE &&
    Number(target) <= GAME_CONSTANTS.DICE_MAX_VALUE;

  return (
    <div className="control-panel">
      <h2>Dice Controls</h2>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Target Value Here..."
        value={target}
        onChange={(e) => {
          const value = e.target.value;

          // allow empty input
          if (value === "") {
            setTarget("");
            resetResultsVals();
            return;
          }

          // digits only
          if (!/^\d*$/.test(value)) return;

          // ❌ block multiple leading zeros like "00", "000", "01"
          if (value.length > 1 && value.startsWith("0")) {
            return;
          }

          const num = Number(value);

          // ❗ BLOCK values greater than max
          if (num > GAME_CONSTANTS.DICE_MAX_VALUE) {
            setTarget(GAME_CONSTANTS.DICE_MAX_VALUE.toString());
            return;
          }

          setTarget(value);
          resetResultsVals();
        }}
        onBlur={() => {
          if (target === "" || target === "0") return;

          const num = Number(target);

          const clamped = Math.min(
            GAME_CONSTANTS.DICE_MAX_VALUE,
            Math.max(GAME_CONSTANTS.DICE_MIN_VALUE, num),
          );

          setTarget(String(clamped));
        }}
      />

      <button disabled={rolling || !isValidTarget} onClick={onRoll}>
        {rolling ? "Rolling..." : "Roll"}
      </button>

      <button onClick={toggleMute}>
        {muted ? "🔇 Sound Off" : "🔊 Sound On"}
      </button>

      <div>Dice Result: {result ?? "-"}</div>

      <div>Win / Loss: {result ? (isWin ? "WIN" : "LOSS") : "-"}</div>

      <div>Win Streak: {streak ?? "-"}</div>

      <div>History: {history.length === 0 ? "-" : history.join(", ")}</div>
    </div>
  );
}
