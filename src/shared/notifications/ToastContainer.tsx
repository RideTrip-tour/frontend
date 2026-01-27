import type { Toast } from "./NotificationContext";

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 9999
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            minWidth: 220,
            background:
              toast.type === "success"
                ? "#1f8f4a"
                : toast.type === "error"
                  ? "#a83232"
                  : "#2f6fed",
            color: "white",
            fontWeight: 500,
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
