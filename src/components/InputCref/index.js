import './InputCref.css';

const InputCref = ({
    label,
    name,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    error,
    numeroCref,
    categoriaCref,
    estado
}) => {
    return (
        <div className="input-cref-group">
            <label>{label}</label>
            <div className="input-cref-row">
                <input
                    className="input-cref numeroCref"
                    id={name}
                    type={type}
                    name={name}
                    value={numeroCref}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                />

                <input
                    className="input-cref categoriaCref"
                    id="inputCategoriaCref"
                    name="inputCategoriaCref"
                    value={categoriaCref}
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
