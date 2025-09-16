import './Button.css';

const Button = ({
  label,
  variant = "primary", // "primary" | "cancel" | "secondary" | "link"
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
