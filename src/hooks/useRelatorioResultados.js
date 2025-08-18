import { useState, useEffect } from 'react';

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

export default function useRelatorioResultados() {
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

    return {
        alunoSelecionado,
        setAlunoSelecionado,
        resultados,
        modalAberto,
        textoObservacao,
        setTextoObservacao,
        abrirModal,
        salvarObservacao,
        setModalAberto
    };
}
