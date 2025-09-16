import Button from 'components/Button';
import './Modal.css';

const ModalPesquisaPersonal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // impede fechamento ao clicar dentro
            >
                <button className="modal-close" onClick={onClose}>✖</button>
                {children}
            </div>
        </div>
    );
};

export default ModalPesquisaPersonal;
