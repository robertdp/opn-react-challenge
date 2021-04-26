import React from "react";

export type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export const ActionButton = ({ onClick, disabled = false, children }: ActionButtonProps): JSX.Element => (
  <button
    className={
      "px-3 py-1 rounded border bg-white" +
      (disabled ? " border-gray-300 text-gray-300" : " border-blue-700 text-blue-700")
    }
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
