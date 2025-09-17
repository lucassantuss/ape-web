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
        alunoSelecionado,
        tipoAcao,
        abrirModalDesvincular,
        abrirModalRecusar,
        confirmarAcao,
        aceitarAluno,
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        fecharModalInfo,
    } = useAlunos();

    const obterStatus = (aluno) => {
        if (!aluno.dataAceitePersonal) return "Pendente";
        if (aluno.aceitePersonal) return "Aceito";
        return "Recusado";
    };

    return (
        <div className="alunos-container">
            {alunos.length === 0 ? (
                <Title titulo="Alunos" titulo2="Nenhum aluno associado ao personal." />
            ) : (
                <>
                    <Title
                        titulo="Gerenciar Alunos"
                        titulo2="Verifique os pedidos de vínculo e os alunos já aceitos"
                    />
                    <div className="alunos-lista">
                        {alunos.map((aluno) => (
                            <div key={aluno.id} className="aluno-card">
                                <p><strong>Nome:</strong> {aluno.nome}</p>
                                <p><strong>Usuário:</strong> {aluno.usuario}</p>
                                <p><strong>Email:</strong> {aluno.email || '-'}</p>
                                <p><strong>Status:</strong> {obterStatus(aluno)}</p>

                                {obterStatus(aluno) === "Pendente" ? (
                                    <div className="botoes-solicitacao">
                                        <Button
                                            label="Aceitar"
                                            onClick={() => aceitarAluno(aluno)}
                                            variant="success"
                                        />
                                        <Button
                                            label="Recusar"
                                            onClick={() => abrirModalRecusar(aluno)}
                                            variant="cancel"
                                        />
                                    </div>
                                ) : obterStatus(aluno) === "Aceito" ? (
                                    <Button
                                        label="Desvincular Aluno"
                                        className="botao-remover"
                                        onClick={() => abrirModalDesvincular(aluno)}
                                        variant="cancel"
                                    />
                                ) : (
                                    <p className="aluno-recusado">Aluno recusado</p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {modalAberto && (
                <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                    {tipoAcao === "desvincular" ? (
                        <>
                            <h3>Confirmar Desvinculação</h3>
                            <p>
                                Tem certeza que deseja <strong>desvincular</strong> o aluno{' '}
                                <strong>{alunoSelecionado?.nome}</strong>?
                                O aluno continuará cadastrado no sistema, mas sem vínculo com este personal.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3>Confirmar Recusa</h3>
                            <p>
                                Tem certeza que deseja <strong>recusar</strong> o aluno{' '}
                                <strong>{alunoSelecionado?.nome}</strong>?
                                Ele não ficará vinculado a você.
                            </p>
                        </>
                    )}

                    <div className="minha-conta-botoes">
                        <Button
                            label="Cancelar"
                            onClick={() => setModalAberto(false)}
                            variant="cancel"
                        />
                        <Button
                            label={tipoAcao === "desvincular" ? "Confirmar Desvinculação" : "Confirmar Recusa"}
                            onClick={confirmarAcao}
                            variant="success"
                        />
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
