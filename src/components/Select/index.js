import './Select.css';

const Select = ({
    label,
    name,
    value,
    onChange,
    options,
    error
}) => {
    return (
        <div className="select-group">
            <label>{label}</label>
            <select name={name} value={value} onChange={onChange}>
                <option value="">Selecione uma das opções</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Select;