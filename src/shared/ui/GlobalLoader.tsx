export function GlobalLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9998
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "5px solid rgba(255,255,255,0.3)",
          borderTop: "5px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      />
      <style>
        {`@keyframes spin { from {transform:rotate(0)} to {transform:rotate(360deg)} }`}
      </style>
    </div>
  );
}
