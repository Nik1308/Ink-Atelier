import React from "react";

const FormSection = ({ title, children, className = "" }) => {
  return (
    <div className={`${className}`}>
      {title ? (
        <div className="font-bold text-lg mb-2 mt-4">{title}</div>
      ) : null}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default FormSection; 