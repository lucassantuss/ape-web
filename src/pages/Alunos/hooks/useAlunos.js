import { useState, useEffect } from 'react';
import useModalInfo from 'components/ModalInfo/hooks/useModalInfo';
import api from 'services/api';

export default function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [tipoAcao, setTipoAcao] = useState(null); // "desvincular" ou "recusar"

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

    // Abrir modal para desvinculação
    const abrirModalDesvincular = (aluno) => {
        setAlunoSelecionado(aluno);
        setTipoAcao("desvincular");
        setModalAberto(true);
    };

    // Abrir modal para recusa
    const abrirModalRecusar = (aluno) => {
        setAlunoSelecionado(aluno);
        setTipoAcao("recusar");
        setModalAberto(true);
    };

    // Confirmar ação (desvincular ou recusar)
    const confirmarAcao = async () => {
        if (!alunoSelecionado || !tipoAcao) return;

        try {
            if (tipoAcao === "desvincular") {
                await api.put(`/Aluno/${alunoSelecionado.id}/remover-personal`);
                setAlunos(alunos.filter(a => a.id !== alunoSelecionado.id));
                exibirModalInfo("Sucesso", "Aluno desvinculado com sucesso!");
            } else if (tipoAcao === "recusar") {
                await api.put(`/Aluno/${alunoSelecionado.id}/recusar-personal`);
                setAlunos(alunos.filter(a => a.id !== alunoSelecionado.id));
                exibirModalInfo("Sucesso", "Aluno recusado com sucesso!");
            }
        } catch (error) {
            exibirModalInfo("Erro", "Não foi possível concluir a ação. Tente novamente.");
        } finally {
            setModalAberto(false);
            setAlunoSelecionado(null);
            setTipoAcao(null);
        }
    };

    // Aceitar aluno direto
    const aceitarAluno = async (aluno) => {
        try {
            await api.put(`/Aluno/${aluno.id}/aceitar-personal`);
            setAlunos(alunos.map(a => 
                a.id === aluno.id ? { ...a, aceito: true } : a
            ));
            exibirModalInfo("Sucesso", "Aluno aceito com sucesso!");
        } catch (error) {
            exibirModalInfo("Erro", "Não foi possível aceitar o aluno.");
        }
    };

    return {
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
    };
}
