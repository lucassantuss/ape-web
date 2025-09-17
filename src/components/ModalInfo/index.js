import Modal from "components/Modal";
import Button from "components/Button";

export default function ModalInfo({
    isOpen,
    onClose,
    title,
    message
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="minha-conta-modal-botoes">
                <Button
                    label="OK"
                    onClick={onClose}
                    variant="success"
                />
            </div>
        </Modal>
    );
}
