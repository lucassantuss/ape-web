import { useState, useEffect } from 'react';
import useModalInfo from 'components/ModalInfo/hooks/useModalInfo';
import api from 'services/api';

export default function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionadoParaRemocao, setAlunoSelecionadoParaRemocao] = useState(null);

    const {
        showModalInfo,
        modalInfoTitle,
        modalInfoMessage,
        exibirModalInfo,
        fecharModalInfo,
    } = useModalInfo();

    const idPersonal = localStorage.getItem('@IdUser_APE');

    // Buscar alunos do personal
    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await api.get(`/Personal/${idPersonal}/alunos`);
                setAlunos(response.data);
            } catch (error) {
                console.error('Erro ao carregar alunos:', error);
                exibirModalInfo("Erro", "Erro ao carregar alunos.");
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
            // Desvincular o personal
            await api.put(`/Aluno/${alunoSelecionadoParaRemocao.id}/remover-personal`);
            setAlunos(alunos.filter(a => a.id !== alunoSelecionadoParaRemocao.id));

            setModalAberto(false);
            setAlunoSelecionadoParaRemocao(null);
            exibirModalInfo("Sucesso", "Aluno desvinculado com sucesso!");
        } catch (error) {
            console.error('Erro ao desvincular aluno do personal:', error);
            exibirModalInfo("Erro", "Não foi possível desvincular o aluno. Tente novamente.");
        }
    };

    return {
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
    };
}
