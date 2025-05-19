import React from "react";
import clsx from "clsx";
import { LuLoaderCircle } from "react-icons/lu";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  loading = false,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        rest.disabled && "opacity-50 cursor-not-allowed",
        loading && "cursor-not-allowed pointer-events-none opacity-50",
        className
      )}
    >
      {leftIcon && !loading && (
        <span className="flex items-center">{leftIcon}</span>
      )}
      <div className="flex items-center gap-2 select-none">
        {children}
        {loading && <LuLoaderCircle className="size-4 animate-spin" />}
      </div>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
