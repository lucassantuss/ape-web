import { useState, useEffect } from 'react';
import api from 'services/api';

export default function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionadoParaRemocao, setAlunoSelecionadoParaRemocao] = useState(null);

    const idPersonal = localStorage.getItem('@IdUser_APE');

    // Buscar alunos do personal
    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await api.get(`/Personal/${idPersonal}/alunos`);
                setAlunos(response.data);
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
            }
        }

        if (idPersonal) fetchAlunos();
    }, [idPersonal]);

    const abrirModal = (aluno) => {
        setAlunoSelecionadoParaRemocao(aluno);
        setModalAberto(true);
    };

    const confirmarRemocao = async () => {
        if (!alunoSelecionadoParaRemocao) return;

        try {
            await api.delete(`/Personal/removerAluno/${alunoSelecionadoParaRemocao.id}`);
            // Atualiza a lista de alunos após remoção
            setAlunos(alunos.filter(a => a.id !== alunoSelecionadoParaRemocao.id));
            setModalAberto(false);
            setAlunoSelecionadoParaRemocao(null);
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
        }
    };

    return {
        alunos,
        modalAberto,
        setModalAberto,
        alunoSelecionadoParaRemocao,
        abrirModal,
        confirmarRemocao
    };
}
