import Title from 'components/Title';
import Button from 'components/Button';
import Modal from 'components/Modal';
import useAlunos from './hooks/useAlunos';
import './Alunos.css';

export default function Alunos() {
    const {
        alunos,
        removerAluno,
        modalAberto,
        setModalAberto,
        alunoSelecionadoParaRemocao,
        abrirModal,
        confirmarRemocao
    } = useAlunos();

    return (
        <div className="alunos-container">
            <Title titulo="Alunos" />

            {alunos.length === 0 ? (
                <Title titulo2="Nenhum aluno associado ao personal." />
            ) : (
                <>
                    <Title titulo2="Visualize e remova alunos caso necessário" />
                    <div className="alunos-lista">
                        {alunos.map((aluno) => (
                            <div key={aluno.id} className="aluno-card">
                                <p><strong>Nome:</strong> {aluno.nome}</p>
                                <p><strong>Email:</strong> {aluno.email || '-'}</p>
                                <Button
                                    label="Remover Aluno"
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
                    <h3>Confirmar Remoção</h3>
                    <p>
                        Tem certeza que deseja remover o aluno{' '}
                        <strong>{alunoSelecionadoParaRemocao?.nome}</strong>? Esta ação é irreversível.
                    </p>
                    <div className="minha-conta-modal-botoes">
                        <Button label="Cancelar" onClick={() => setModalAberto(false)} cancel />
                        <Button label="Confirmar Remoção" onClick={confirmarRemocao} />
                    </div>
                </Modal>
            )}
        </div>
    );
}
