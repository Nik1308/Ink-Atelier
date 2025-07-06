import React from "react";

const RadioGroup = ({
  question,
  name,
  value,
  onChange,
  required = false,
  showTextarea = false,
  textareaName,
  textareaValue,
  textareaPlaceholder,
  inputClassName = "",
  isLast = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 mb-2 ${!isLast ? 'border-b border-gray-200 pb-4' : ''}`}>
      <label className="mb-1 font-medium text-base text-black">{question} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex gap-8 pl-4">
        <label htmlFor={`${name}-yes`} className="flex items-center gap-2">
          <input
            id={`${name}-yes`}
            type="radio"
            name={name}
            value="yes"
            checked={value === "yes"}
            onChange={onChange}
            required={required}
            className="accent-black border border-gray-400 w-5 h-5"
          />
          <span>Yes</span>
        </label>
        <label htmlFor={`${name}-no`} className="flex items-center gap-2">
          <input
            id={`${name}-no`}
            type="radio"
            name={name}
            value="no"
            checked={value === "no"}
            onChange={onChange}
            required={required}
            className="accent-black border border-gray-400 w-5 h-5"
          />
          <span>No</span>
        </label>
      </div>
      {showTextarea && value === "yes" && (
        <div className="flex flex-col gap-2 mt-2 pl-4">
          <label htmlFor={textareaName} className="text-sm text-gray-700">If yes, please specify</label>
          <textarea
            id={textareaName}
            name={textareaName}
            placeholder={textareaPlaceholder}
            value={textareaValue}
            onChange={onChange}
            className={`bg-offwhite text-black border border-gray-300 rounded px-3 py-2 text-base ${inputClassName}`}
          />
        </div>
      )}
    </div>
  );
};

export default RadioGroup; 