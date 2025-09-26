import Button from 'components/Button';
import Modal from 'components/Modal';
import Select from 'components/Select';
import TextArea from 'components/TextArea';
import Title from 'components/Title';
import useRelatorioResultados from 'pages/RelatorioResultados/hooks/useRelatorioResultados';

import './RelatorioResultados.css';

const RelatorioResultados = () => {
    const {
        alunos,
        alunoSelecionado,
        setAlunoSelecionado,
        resultados,
        modalAberto,
        textoObservacao,
        setTextoObservacao,
        abrirModal,
        salvarObservacao,
        setModalAberto,
    } = useRelatorioResultados();

    return (
        <div className="relatorio-container">
            <Title
                titulo="Relatório de Exercícios"
            />

            {alunos.length === 0 ? (
                <Title titulo2="Nenhum aluno associado ao personal." />
            ) : (
                <>
                    <Title titulo2="Selecione um aluno para visualizar os treinos realizados" />
                    <Select
                        label="Aluno"
                        name="aluno"
                        value={alunoSelecionado}
                        onChange={(e) => setAlunoSelecionado(e.target.value)}
                        options={alunos}
                    />
                </>
            )}

            {alunoSelecionado && resultados.length === 0 && (
                <Title titulo2="Esse aluno ainda não possui treinos registrados." />
            )}

            {resultados.length > 0 && (
                <div className="relatorio-lista">
                    {resultados.map((resultado) => (
                        <div key={resultado.id} className="relatorio-card">
                            <h3>{resultado.nome}</h3>
                            <p><strong>Data:</strong> {resultado.dataExecucao}</p>
                            <p><strong>Repetições:</strong> {resultado.quantidadeRepeticoes}</p>
                            <p><strong>Acerto:</strong> {resultado.porcentagemAcertos + "%" ?? "-"}</p>
                            <p><strong>Tempo Executado:</strong> {resultado.tempoExecutado || "-"}</p>
                            <p><strong>Observações do Aluno:</strong> {resultado.observacoesAluno || 'Nenhuma'}</p>
                            <p><strong>Sua Observação:</strong> {resultado.observacoesPersonal || 'Nenhuma'}</p>
                            <br />
                            <Button
                                label="Adicionar Observação"
                                className="botao-observacao"
                                onClick={() => abrirModal(resultado.id)}
                                variant="success"
                            />
                        </div>
                    ))}
                </div>
            )}

            {modalAberto && (
                <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                    <h4>Adicionar Observação do Personal</h4>
                    <TextArea
                        value={textoObservacao}
                        onChange={(e) => setTextoObservacao(e.target.value)}
                        rows={5}
                        placeholder="Digite sua observação aqui..."
                    />
                    <div className="modal-botoes">
                        <Button
                            label="Cancelar"
                            onClick={() => setModalAberto(false)}
                            variant="cancel"
                        />
                        <Button
                            label="Salvar"
                            onClick={salvarObservacao}
                            variant="success"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default RelatorioResultados;
