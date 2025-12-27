import React from "react";

const LoadingSpinner = ({ 
  size = "md", 
  text = "Loading...", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 mx-auto ${sizeClasses[size]}`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;