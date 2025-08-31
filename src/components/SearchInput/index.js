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
        <div>
            {label && <label>{label}</label>}
            <div className="searchInput-group">
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
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default SearchInput;