import Title from 'components/Title';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalInfo from "components/ModalInfo";
import useAlunos from './hooks/useAlunos';
import './Alunos.css';

export default function Alunos() {
    const {
        alunos,
        modalAberto,
        setModalAberto,
        alunoSelecionadoParaRemocao,
        abrirModal,
        confirmarRemocao,
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        fecharModalInfo,
    } = useAlunos();

    return (
        <div className="alunos-container">
            {alunos.length === 0 ? (
                <Title titulo="Alunos" titulo2="Nenhum aluno associado ao personal." />
            ) : (
                <>
                    <Title titulo="Alunos" titulo2="Visualize os alunos e desvincule, caso necessário" />
                    <div className="alunos-lista">
                        {alunos.map((aluno) => (
                            <div key={aluno.id} className="aluno-card">
                                <p><strong>Nome:</strong> {aluno.nome}</p>
                                <p><strong>Email:</strong> {aluno.email || '-'}</p>
                                <Button
                                    label="Desvincular Aluno"
                                    className="botao-remover"
                                    onClick={() => abrirModal(aluno)}
                                    cancel
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {modalAberto && (
                <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                    <h3>Confirmar Desvinculação</h3>
                    <p>
                        Tem certeza que deseja <strong>desvincular</strong> o aluno{' '}
                        <strong>{alunoSelecionadoParaRemocao?.nome}</strong>?
                        O aluno continuará cadastrado no sistema, mas sem vínculo com este personal.
                    </p>
                    <div className="minha-conta-modal-botoes">
                        <Button label="Cancelar" onClick={() => setModalAberto(false)} cancel />
                        <Button label="Confirmar Desvinculação" onClick={confirmarRemocao} />
                    </div>
                </Modal>
            )}

            <ModalInfo
                isOpen={showModalInfo}
                onClose={fecharModalInfo}
                title={modalInfoTitle}
                message={modalInfoMessage}
            />
        </div>
    );
}
