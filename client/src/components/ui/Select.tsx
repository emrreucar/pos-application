import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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
  // for react-hook-form
  name?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  ref?: React.Ref<any>;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seçiniz...",
  label,
  errorMessage,
  ...rest
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        className={`w-full border px-3 py-2 rounded-md flex justify-between items-center bg-white text-sm text-gray-700 shadow-sm hover:border-gray-200 ${
          errorMessage ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        {...rest} // support react-hook-form
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-1 w-full bg-white border rounded-md shadow-lg h-44 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b text-sm outline-none"
            placeholder="Ara..."
          />
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
