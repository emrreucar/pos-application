import React, { InputHTMLAttributes, useId, useState } from "react";
import clsx from "clsx";
import { EyeOffIcon, EyeIcon } from "lucide-react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
  value: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputSize?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  inputSize = "md",
  icon,
  errorMessage,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const inputId = useId();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const sizeClasses = {
    sm: {
      input: "px-2 pt-3 pb-1 text-sm",
      label: {
        default: "left-2 peer-placeholder-shown:top-2.5",
        active: "-top-2 text-xs",
      },
    },
    md: {
      input: "px-3 pt-4 pb-2 text-base",
      label: {
        default: "left-3 peer-placeholder-shown:top-3.5",
        active: "-top-2 text-xs",
      },
    },
    lg: {
      input: "px-4 pt-5 pb-2.5 text-lg",
      label: {
        default: "left-4 peer-placeholder-shown:top-4",
        active: "-top-2 text-sm",
      },
    },
  };

  const currentSize = sizeClasses[inputSize];

  return (
    <>
      <div className="relative w-full">
        <input
          type={inputType}
          id={inputId}
          {...rest}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete="off"
          className={clsx(
            "peer w-full border border-gray-300 rounded-md px-3 pt-4 pb-2 text-base outline-none",
            "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            currentSize.input,
            icon && "pl-10",
            errorMessage &&
              "border-red-500 focus:border-red-500 focus:ring-red-500",
            rest.disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <label
          htmlFor={inputId}
          className={clsx(
            "select-none absolute left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-200",
            "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400",
            "peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 hover:cursor-text transition-all duration-300 ease-in-out",
            value ? "-top-2 text-xs text-blue-500" : "top-2.5",
            currentSize.label.default
              ? currentSize.label.default
              : currentSize.label.active,
            icon && "left-8",
            errorMessage && "!text-red-500"
          )}
        >
          {label}
        </label>

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
          </button>
        )}

        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>

      {errorMessage && (
        <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
      )}
    </>
  );
};

export default Input;
