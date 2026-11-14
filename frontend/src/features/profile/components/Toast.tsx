import { useEffect, useState } from "react";

type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const toastStyles: Record<ToastType, string> = {
  success: "bg-teal-50 text-teal-800 border-teal-200",
  error: "bg-red-50 text-red-700 border-red-200",
};

export const Toast = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      const removeTimer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(removeTimer);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleManualClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm w-full pointer-events-none">
      <div
        className={`pointer-events-auto transform transition-all duration-300 ease-in-out shadow-lg rounded-xl px-4 py-3 text-sm flex items-center justify-between gap-3 border ${toastStyles[type]
          } ${isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-3 scale-95"
          }`}
        role={type === "error" ? "alert" : "status"}
      >
        <span className="leading-snug warp-break-words">{message}</span>
        <button
          type="button"
          onClick={handleManualClose}
          className="shrink-0 text-sm font-bold opacity-70 hover:opacity-100 cursor-pointer"
          aria-label="Закрити"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
