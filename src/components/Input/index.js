import './Input.css';

const Input = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    error
}) => {
    return (
        <div className="input-group">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;