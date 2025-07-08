import React from "react";

const positionClasses = {
  center: "items-center justify-center text-center",
  left: "items-center justify-start text-left",
  right: "items-center justify-end text-right",
  top: "items-start justify-center text-center",
  bottom: "items-end justify-center text-center",
  "top-left": "items-start justify-start text-left",
  "top-right": "items-start justify-end text-right",
  "bottom-left": "items-end justify-start text-left",
  "bottom-right": "items-end justify-end text-right",
  "center-left": "items-center justify-start text-left",
  "center-right": "items-center justify-end text-right",
};

export default function OverlayPositioner({ position = "center", className = "", contentClassName = "", children }) {
  return (
    <div className={`absolute inset-0 flex z-10 pointer-events-none ${positionClasses[position] || positionClasses.center} ${className}`}>
      <div className={`px-8 py-10 pointer-events-auto ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
} 