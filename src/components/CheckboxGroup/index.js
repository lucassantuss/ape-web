import './CheckboxGroup.css';

const CheckboxGroup = ({ label, name, options, selectedOptions, onChange, error }) => {
    const handleCheckboxChange = (e, optionValue) => {
        let updatedSelectedOptions = [...selectedOptions];

        if (updatedSelectedOptions.includes(optionValue)) {
            updatedSelectedOptions = updatedSelectedOptions.filter(option => option !== optionValue);
        } else {
            updatedSelectedOptions.push(optionValue);
        }

        onChange(name, updatedSelectedOptions);
    };

    return (
        <div className="checkbox-group">
            <label>{label}</label>
            <div className="checkbox-options">
                {options.map((option, index) => (
                    <label 
                        key={index} 
                        className={`checkbox-option ${selectedOptions.includes(option.value) ? 'selected' : ''}`}
                        onClick={() => handleCheckboxChange(null, option.value)}
                    >
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedOptions.includes(option.value)}
                            onChange={() => handleCheckboxChange(null, option.value)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default CheckboxGroup;