import Button from 'components/Button';
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
                <Button
                    label="🔍"
                    type="button"
                    onClick={onClick}
                    className="search-button"
                    variant="info"
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default SearchInput;