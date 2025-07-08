import React from "react";

const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  className = "" 
}) => {
  return (
    <div className={`px-4 py-6 sm:px-0 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {action && (
          <div>{action}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 