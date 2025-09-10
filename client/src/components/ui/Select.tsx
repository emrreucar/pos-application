import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seçiniz...",
  label,
  errorMessage,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label
          className={`text-sm font-medium mb-1 flex items-center gap-px ${
            errorMessage ? "text-red-500" : "text-gray-700"
          }`}
        >
          {required && (
            <span
              className={clsx(errorMessage ? "text-red-500" : "text-gray-500")}
            >
              *
            </span>
          )}
          {label}
        </label>
      )}

      <div className="flex items-center justify-between relative">
        <input
          type="text"
          value={isOpen ? search : selected?.label || ""}
          onChange={(e) => {
            if (isOpen) {
              setSearch(e.target.value);
            }
          }}
          onClick={() => setIsOpen(true)}
          readOnly={!isOpen}
          className={`outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full border px-3 py-3 rounded-md bg-white text-sm text-gray-700 shadow-sm hover:border-gray-200 ${
            errorMessage ? "border-red-500" : ""
          }`}
          placeholder={placeholder}
        />
        <ChevronDown
          size={16}
          className={`absolute top-3 right-2 ${
            isOpen ? "rotate-180" : ""
          } transition-transform duration-200 cursor-pointer`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-40 mt-1 w-full bg-white border rounded-md shadow-lg max-h-44 overflow-y-auto">
          <ul className="divide-y">
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
              >
                {opt.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">Sonuç yok</li>
            )}
          </ul>
        </div>
      )}

      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
