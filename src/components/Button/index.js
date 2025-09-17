import './Button.css';

const Button = ({
  label,
  variant = "default", // "default" | "success" | "info" | "info-2" | "cancel" | "secondary" | "link"
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
