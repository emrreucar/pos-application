interface SwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  text?: string;
  subText?: string;
  reverseText?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  isChecked,
  onChange,
  disabled,
  text,
  subText,
  reverseText,
}) => {
  const toggleSwitch = () => {
    if (disabled) return;
    onChange(!isChecked);
  };

  return (
    <div className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
      {text && !reverseText && (
        <span className="text-sm font-medium">{text}</span>
      )}

      <div
        className={`relative inline-flex items-center w-12 h-6 rounded-full cursor-pointer ${
          isChecked ? "bg-blue-500" : "bg-gray-300"
        } ${disabled ? "!cursor-not-allowed" : ""}`}
        onClick={toggleSwitch}
        aria-disabled={disabled}
      >
        <span
          className={`absolute left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isChecked ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </div>
      {text && reverseText && (
        <span className="text-sm font-medium">{text}</span>
      )}
      {subText && <span className="text-xs text-gray-500">({subText})</span>}
    </div>
  );
};

export default Switch;
