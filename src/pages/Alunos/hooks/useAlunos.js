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

    // Função para buscar alunos do personal
    const fetchAlunos = async () => {
        if (!idPersonal) return;
        try {
            const response = await api.get(`/Personal/${idPersonal}/alunos`);
            setAlunos(response.data);
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
            exibirModalInfo("Erro", "Erro ao carregar alunos.");
        }
    };

    useEffect(() => {
        fetchAlunos();
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
                // Atualiza lista removendo o aluno
                setAlunos(prev => prev.filter(a => a.id !== alunoSelecionado.id));
                exibirModalInfo("Sucesso", "Aluno desvinculado com sucesso!");
            } else if (tipoAcao === "recusar") {
                await api.post(`/Personal/recusar/${alunoSelecionado.id}`);
                // Atualiza lista marcando como recusado
                setAlunos(prev => prev.map(a => 
                    a.id === alunoSelecionado.id
                        ? { ...a, aceitePersonal: false, dataAceitePersonal: new Date().toISOString() }
                        : a
                ));
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
            await api.post(`/Personal/aceitar/${aluno.id}`);
            // Atualiza lista marcando como aceito
            setAlunos(prev => prev.map(a => 
                a.id === aluno.id
                    ? { ...a, aceitePersonal: true, dataAceitePersonal: new Date().toISOString() }
                    : a
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
        fetchAlunos
    };
}
