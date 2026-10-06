import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#262a34] text-[#00f0ff] border border-[#00dbe9] font-code-sm text-[11px] px-3.5 py-2.5 shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="material-symbols-outlined text-[16px] text-[#4edea3]">
        check_circle
      </span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#849495] hover:text-[#dfe2ef] transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
};
