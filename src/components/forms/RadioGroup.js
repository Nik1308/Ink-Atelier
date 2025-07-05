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
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="mb-1">{question}</label>
      <div className="flex gap-8 ml-6">
        <label htmlFor={`${name}-yes`} className="flex items-center gap-2">
          <input
            id={`${name}-yes`}
            type="radio"
            name={name}
            value="yes"
            checked={value === "yes"}
            onChange={onChange}
            required={required}
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
          />
          <span>No</span>
        </label>
      </div>
      {showTextarea && value === "yes" && (
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor={textareaName}>If yes, please specify</label>
          <textarea
            id={textareaName}
            name={textareaName}
            placeholder={textareaPlaceholder}
            value={textareaValue}
            onChange={onChange}
            className="bg-offwhite text-black border border-gray-400 rounded px-3 py-2"
          />
        </div>
      )}
    </div>
  );
};

export default RadioGroup; 