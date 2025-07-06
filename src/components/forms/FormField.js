import React from "react";

const FormField = React.forwardRef(({
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
  inputClassName = "",
  containerClassName = "",
  ...props
}, ref) => {
  const defaultInputClasses =
    "bg-white text-black border border-black rounded-lg px-4 py-3 text-lg w-full max-w-[400px] outline-none";

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
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
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
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
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
            className={`${defaultInputClasses} ${inputClassName}`}
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
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
            {...props}
          />
        );
      
      case "phone":
        return (
          <div className="flex items-center">
            <span className="bg-gray-100 border border-black rounded-l-lg px-4 py-3 text-gray-700 font-semibold text-lg select-none">+91</span>
            <input
              id={name}
              name={name}
              type="tel"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              pattern="\d{10}"
              maxLength={10}
              className={`bg-white text-black border border-black border-l-0 rounded-none rounded-r-lg px-4 py-3 text-lg w-full max-w-[400px] outline-none ${inputClassName}`}
              style={{ borderLeft: 'none' }}
              ref={ref}
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
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      <label htmlFor={name} className="flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
    </div>
  );
});

export default FormField; 