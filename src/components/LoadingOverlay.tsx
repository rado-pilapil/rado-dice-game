export default function LoadingOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        color: "white",
      }}
    >
      Loading Dice Game...
    </div>
  );
}
