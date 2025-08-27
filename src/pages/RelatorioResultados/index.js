import Title from 'components/Title';
import Select from 'components/Select';
import Button from 'components/Button';
import TextArea from 'components/TextArea';
import useRelatorioResultados from 'hooks/useRelatorioResultados';
import './RelatorioResultados.css';

const RelatorioResultados = () => {
    const {
        alunoSelecionado,
        setAlunoSelecionado,
        resultados,
        modalAberto,
        textoObservacao,
        setTextoObservacao,
        abrirModal,
        salvarObservacao,
        setModalAberto
    } = useRelatorioResultados();

    return (
        <div className="relatorio-container">
            <Title
                titulo="Relatório de Exercícios"
                titulo2="Selecione um aluno para visualizar os treinos realizados"
            />

            <Select
                label="Aluno"
                name="aluno"
                value={alunoSelecionado}
                onChange={(e) => setAlunoSelecionado(e.target.value)}
                options={[
                    { value: '1', label: 'Lucas Andrade' },
                    { value: '2', label: 'Fernanda Lima' }
                ]}
            />

            {resultados.length > 0 && (
                <div className="relatorio-lista">
                    {resultados.map((resultado, index) => (
                        <div key={index} className="relatorio-card">
                            <h3>{resultado.exercicio}</h3>
                            <p><strong>Data:</strong> {new Date(resultado.dataHora).toLocaleString()}</p>
                            <p><strong>Repetições:</strong> {resultado.repeticoes}</p>
                            <p><strong>Observações do Aluno:</strong> {resultado.observacaoAluno || 'Nenhuma'}</p>
                            <p><strong>Observações do Personal:</strong> {resultado.observacaoPersonal || 'Nenhuma'}</p>
                            <br />
                            <Button 
                                label={`Adicionar Observação`}
                                className="botao-observacao" 
                                onClick={() => abrirModal(index)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {modalAberto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Adicionar Observação do Personal</h4>
                        <TextArea
                            value={textoObservacao}
                            onChange={(e) => setTextoObservacao(e.target.value)}
                            rows={5}
                            placeholder="Digite sua observação aqui..."
                        />
                        <div className="modal-botoes">
                            <Button label={`Salvar`} onClick={salvarObservacao} />
                            <br />
                            <Button label={`Cancelar`} onClick={() => setModalAberto(false)} cancel />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatorioResultados;
