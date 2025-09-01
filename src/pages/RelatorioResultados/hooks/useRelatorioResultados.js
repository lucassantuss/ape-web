import { useState, useEffect } from 'react';
import api from 'services/api';

export default function useRelatorioResultados() {
    const [alunos, setAlunos] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState('');
    const [resultados, setResultados] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [textoObservacao, setTextoObservacao] = useState('');
    const [idExercicioSelecionado, setIdExercicioSelecionado] = useState(null);

    const idPersonal = localStorage.getItem('@IdUser_APE');

    // Buscar alunos do personal
    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await api.get(`/Personal/${idPersonal}/alunos`);
                const listaAlunos = response.data.map((aluno) => ({
                    value: aluno.id,
                    label: aluno.nome
                }));
                setAlunos(listaAlunos);
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
            }
        }

        if (idPersonal) {
            fetchAlunos();
        }
    }, [idPersonal]);

    // Buscar treinos do aluno selecionado
    useEffect(() => {
        async function fetchResultados() {
            if (!alunoSelecionado) {
                setResultados([]);
                return;
            }

            try {
                const response = await api.get(`/Exercicio/listByIdUser/${alunoSelecionado}`);
                setResultados(response.data);
            } catch (error) {
                console.error('Erro ao carregar resultados:', error);
            }
        }

        fetchResultados();
    }, [alunoSelecionado]);

    const abrirModal = (idExercicio) => {
        setIdExercicioSelecionado(idExercicio);
        setTextoObservacao('');
        setModalAberto(true);
    };

    const salvarObservacao = async () => {
        try {
            await api.put(
                `/Exercicio/adicionarObservacaoPersonal/${idExercicioSelecionado}`,
                JSON.stringify(textoObservacao),
                { headers: { 'Content-Type': 'application/json' } }
            );

            setModalAberto(false);
            setTextoObservacao('');

            // Atualiza histórico após salvar
            if (alunoSelecionado) {
                const response = await api.get(`/Exercicio/listByIdUser/${alunoSelecionado}`);
                setResultados(response.data);
            }
        } catch (error) {
            console.error('Erro ao salvar observação do personal:', error);
        }
    };

    return {
        alunos,
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
