import { useState, useEffect } from 'react';
import Title from 'components/Title';
import Select from 'components/Select';
import './RelatorioResultados.css';
import Button from 'components/Button';
import TextArea from 'components/TextArea';

const RelatorioResultados = () => {
    const mockAlunos = [
        { value: '1', label: 'Lucas Andrade' },
        { value: '2', label: 'Fernanda Lima' }
    ];

    const mockResultadosPorAluno = {
        '1': [
            {
                exercicio: 'Rosca Direta',
                dataHora: '2025-08-01T10:30:00',
                repeticoes: 12,
                observacaoAluno: 'Execução perfeita.',
                observacaoPersonal: ''
            },
            {
                exercicio: 'Meio-Agachamento',
                dataHora: '2025-07-30T09:00:00',
                repeticoes: 15,
                observacaoAluno: 'Alinhamento corrigido.',
                observacaoPersonal: 'Bom progresso.'
            }
        ],
        '2': [
            {
                exercicio: 'Meio-Agachamento',
                dataHora: '2025-07-29T08:15:00',
                repeticoes: 20,
                observacaoAluno: 'Boa resistência.',
                observacaoPersonal: ''
            }
        ]
    };

    const [alunoSelecionado, setAlunoSelecionado] = useState('');
    const [resultados, setResultados] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [textoObservacao, setTextoObservacao] = useState('');
    const [indiceSelecionado, setIndiceSelecionado] = useState(null);

    useEffect(() => {
        if (alunoSelecionado) {
            const resultadosMock = mockResultadosPorAluno[alunoSelecionado] || [];
            setResultados(resultadosMock);
        } else {
            setResultados([]);
        }
    }, [alunoSelecionado]);

    const abrirModal = (index) => {
        setIndiceSelecionado(index);
        setTextoObservacao(resultados[index]?.observacaoPersonal || '');
        setModalAberto(true);
    };

    const salvarObservacao = () => {
        if (indiceSelecionado !== null) {
            const novosResultados = [...resultados];
            novosResultados[indiceSelecionado].observacaoPersonal = textoObservacao;
            setResultados(novosResultados);
        }
        setModalAberto(false);
    };

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
                options={mockAlunos}
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
                            <br></br>
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
                            <br></br>
                            <Button label={`Cancelar`} onClick={() => setModalAberto(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatorioResultados;
