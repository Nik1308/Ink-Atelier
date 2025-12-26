import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { COUNTRY_CODES, getDefaultCountryCode } from "../../../utils/countryCodes";
import { extractCountryCode, getPhoneWithoutCountryCode } from "../../../utils/phoneUtils";

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
  labelClassName = "",
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
        const PhoneInputWithCountryCode = () => {
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
            } else if (value) {
              return value.replace(/\D/g, '');
            }
            return '';
          };
          
          // Use derived values directly - no local state for country code
          const currentCountryCode = getCountryCodeFromValue();
          const currentPhoneWithoutCode = getPhoneWithoutCodeFromValue();
          
          // Track the last value we set to avoid circular updates
          const lastSetValueRef = useRef(value || '');
          
          // Update ref when value changes externally
          useEffect(() => {
            if (value !== lastSetValueRef.current) {
              // Value changed externally, update ref
              lastSetValueRef.current = value || '';
            }
          }, [value]);
          
          const handleCountryCodeChange = (e) => {
            const newCode = e.target.value;
            // Combine new country code with existing phone number
            const fullPhone = currentPhoneWithoutCode ? `${newCode}${currentPhoneWithoutCode}` : newCode;
            
            // Update ref to prevent useEffect from resetting
            lastSetValueRef.current = fullPhone;
            
            // Call onChange to update parent
            if (onChange) {
              onChange({
                target: {
                  name,
                  value: fullPhone
                }
              });
            }
          };
          
          const handlePhoneChange = (e) => {
            const phoneNum = e.target.value.replace(/\D/g, ''); // Only digits
            const fullPhone = phoneNum ? `${currentCountryCode}${phoneNum}` : '';
            
            // Update ref to prevent useEffect from resetting
            lastSetValueRef.current = fullPhone;
            
            // Call onChange to update parent
            if (onChange) {
              onChange({
                target: {
                  name,
                  value: fullPhone
                }
              });
            }
          };
          
          return (
            <div className="flex items-stretch w-full bg-white rounded-lg border border-black overflow-hidden">
              <div className="relative bg-gray-100 border-0 border-r border-black flex-shrink-0 flex items-center" style={{ width: '90px' }}>
                <select
                  value={currentCountryCode}
                  onChange={handleCountryCodeChange}
                  className="bg-transparent border-0 px-2 py-3 pr-6 text-gray-700 font-semibold text-sm cursor-pointer outline-none appearance-none w-full h-full"
                  style={{ fontSize: '14px' }}
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <FiChevronDown className="text-gray-600" size={14} />
                </div>
              </div>
              <input
                id={name}
                name={name}
                type="tel"
                placeholder={placeholder || "Phone number"}
                value={currentPhoneWithoutCode}
                onChange={handlePhoneChange}
                pattern="[\d\s\-\(\)]{7,15}"
                maxLength={15}
                className={`bg-white text-black border-0 px-4 py-3 text-lg flex-1 outline-none ${inputClassName}`}
                ref={ref}
                {...props}
              />
            </div>
          );
        };
        return <PhoneInputWithCountryCode />;
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
      <label htmlFor={name} className={`flex items-center gap-1 ${labelClassName}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
    </div>
  );
});

export default FormField; 