import './InputCref.css';

const InputCref = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    error,
    categoriaProf,
    estado
}) => {
    return (
        <div className="input-cref-group">
            <label>{label}</label>
            <div className="input-cref-row">
                <input
                    className="input-cref cref"
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                />

                <input
                    className="input-cref categoria"
                    id="inputCategoriaProf"
                    name="inputCategoriaProf"
                    value={categoriaProf}
                    maxLength={1}
                    disabled
                />

                <input
                    className="input-cref estado"
                    id="inputEstado"
                    name="inputEstado"
                    value={estado}
                    maxLength={2}
                    disabled
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputCref;
