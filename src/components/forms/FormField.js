import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  options = [],
  rows = 3,
  step,
  min,
  accept,
  ref,
  ...props
}) => {
  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
            {...props}
          />
        );
      
      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
            {...props}
          >
            <option value="">{placeholder || "Select an option"}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "file":
        return (
          <input
            ref={ref}
            id={name}
            name={name}
            type="file"
            accept={accept}
            onChange={onChange}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
            {...props}
          />
        );
      
      case "number":
        return (
          <input
            id={name}
            name={name}
            type="number"
            step={step}
            min={min}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
            {...props}
          />
        );
      
      case "phone":
        return (
          <div className="flex items-center">
            <span className="bg-gray-200 border border-gray-400 rounded-l px-3 py-2 text-gray-700 select-none">+91</span>
            <input
              id={name}
              name={name}
              type="tel"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              pattern="\d{10}"
              maxLength={10}
              className="bg-offwhite text-black border-t border-b border-r border-gray-400 rounded-r px-3 py-2 w-full focus:outline-none"
              style={{ borderLeft: 'none' }}
              {...props}
            />
          </div>
        );
      
      default:
        return (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
            {...props}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default FormField; 