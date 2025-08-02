import './SearchInput.css';

const SearchInput = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    error,
    onClick,
    readOnly
}) => {
    return (
        <div className="searchInput-group">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                readOnly={readOnly}
            />
            <button type="button" onClick={onClick}>🔍</button>
            <br />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default SearchInput;