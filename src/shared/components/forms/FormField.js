import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { COUNTRY_CODES, getDefaultCountryCode } from "../../utils/countryCodes";
import { extractCountryCode, getPhoneWithoutCountryCode } from "../../utils/phone";

// Separate component for phone input to allow hooks
const PhoneInputWithCountryCode = React.forwardRef(({ value, onChange, name, placeholder, inputClassName, ...props }, ref) => {
  // Use refs to maintain focus
  const phoneInputRef = useRef(null);
  const cursorPositionRef = useRef(null);
  const wasFocusedRef = useRef(false);
  const lastSetValueRef = useRef(value || '');
  const isInternalUpdateRef = useRef(false);
  
  // Derive country code and phone number from value prop
  const getCountryCodeFromValue = () => {
    if (value && value.startsWith('+')) {
      const extractedCode = extractCountryCode(value, COUNTRY_CODES);
      return extractedCode || getDefaultCountryCode();
    }
    return getDefaultCountryCode();
  };
  
  const getPhoneWithoutCodeFromValue = () => {
    if (value && value.startsWith('+')) {
      const extractedCode = extractCountryCode(value, COUNTRY_CODES);
      if (extractedCode) {
        return getPhoneWithoutCountryCode(value, COUNTRY_CODES);
      }
      return value.replace(/^\+/, '');
    }
    return value || '';
  };
  
  const currentCountryCode = getCountryCodeFromValue();
  const currentPhoneWithoutCode = getPhoneWithoutCodeFromValue();
  
  // Track external value changes
  useEffect(() => {
    if (value !== lastSetValueRef.current && !isInternalUpdateRef.current) {
      lastSetValueRef.current = value || '';
    }
    isInternalUpdateRef.current = false;
  }, [value]);
  
  // Restore focus and cursor position after render
  useEffect(() => {
    if (phoneInputRef.current && wasFocusedRef.current) {
      const cursorPos = cursorPositionRef.current !== null ? cursorPositionRef.current : phoneInputRef.current.value.length;
      requestAnimationFrame(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.focus();
          phoneInputRef.current.setSelectionRange(cursorPos, cursorPos);
          wasFocusedRef.current = false;
        }
      });
    }
  });
  
  const handleCountryCodeChange = (e) => {
    const newCountryCode = e.target.value;
    const newPhone = newCountryCode + currentPhoneWithoutCode;
    isInternalUpdateRef.current = true;
    lastSetValueRef.current = newPhone;
    onChange({ target: { name, value: newPhone } });
  };
  
  const handlePhoneChange = (e) => {
    const newPhoneWithoutCode = e.target.value;
    const newPhone = currentCountryCode + newPhoneWithoutCode;
    
    // Store cursor position before update
    if (phoneInputRef.current) {
      cursorPositionRef.current = e.target.selectionStart;
      wasFocusedRef.current = document.activeElement === phoneInputRef.current;
    }
    
    isInternalUpdateRef.current = true;
    lastSetValueRef.current = newPhone;
    onChange({ target: { name, value: newPhone } });
  };
  
  return (
    <div className="flex items-stretch w-full bg-white rounded-lg border border-black overflow-hidden">
      <div className="flex items-center bg-gray-200 border-r border-black">
        <select
          value={currentCountryCode}
          onChange={handleCountryCodeChange}
          className="bg-gray-200 text-black border-0 px-2 py-3 text-base outline-none cursor-pointer appearance-none"
          style={{ width: '67px', minWidth: '67px' }}
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
        <div className="relative flex items-center px-1 pointer-events-none">
          <FiChevronDown className="text-black" size={14} />
        </div>
      </div>
      <input
        ref={(node) => {
          phoneInputRef.current = node;
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        id={name}
        name={name}
        type="tel"
        placeholder={placeholder || "Phone number"}
        value={currentPhoneWithoutCode}
        onChange={handlePhoneChange}
        pattern="[\d\s\-\(\)]{7,15}"
        maxLength={15}
        className={`bg-white text-black border-0 px-4 py-3 text-lg flex-1 outline-none ${inputClassName}`}
        {...props}
      />
    </div>
  );
});

const FormField = React.forwardRef(({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  inputClassName = "",
  className = "",
  containerClassName = "",
  labelClassName = "",
  options = [],
  rows = 3,
  step,
  min,
  accept,
  max,
  pattern,
  inputMode,
  onBlur,
  readOnly = false,
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
            max={max}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            pattern={pattern}
            inputMode={inputMode}
            onBlur={onBlur}
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
            {...props}
          />
        );
      case "phone":
        return (
          <PhoneInputWithCountryCode
            value={value}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            inputClassName={inputClassName}
            ref={ref}
            {...props}
          />
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
            onBlur={onBlur}
            className={`${defaultInputClasses} ${inputClassName}`}
            ref={ref}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${containerClassName || className}`}>
      <label htmlFor={name} className={`flex items-center gap-1 ${labelClassName || 'text-black'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
