"use client";
import { useEffect } from "react";
import { ErrorModalProps } from "../../types/modal.ts";
import { useTranslations } from "next-intl";

export default function ErrorModal({
  open,
  title,
  message,
  onClose,
}: ErrorModalProps) {
  const modal = useTranslations("Modal");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (open) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl transition-transform animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mb-2 text-sm text-red-600">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-99"
          >
            {modal("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
