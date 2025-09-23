import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import api from "services/api";
import { verificarAceite } from 'utils/VerificarAceite';

export function usePoseDetection(initialExercise = 'roscaDireta') {
    const navigate = useNavigate();

    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const poseRef = useRef(null);
    const rafRef = useRef(null);
    const stageRef = useRef('---');
    const acertosRef = useRef(0);
    const errosRef = useRef(0);

    const [counter, setCounter] = useState(0);
    const [angle, setAngle] = useState(0);
    const [exercise, setExercise] = useState(initialExercise);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const [facingMode, setFacingMode] = useState("user");

    const [showModal, setShowModal] = useState(false);
    const [showModalLimpar, setShowModalLimpar] = useState(false);
    const [showModalFinal, setShowModalFinal] = useState(false);
    const [contador, setContador] = useState(0);
    const [mostrarStatus, setMostrarStatus] = useState(false);
    const [mensagemAcao, setMensagemAcao] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [feedback, setFeedback] = useState("");

    const [autorizadoAcessoAluno, setAutorizadoAcessoAluno] = useState(null);
    const [mensagemAcessoAluno, setMensagemAcessoAluno] = useState("");
    useEffect(() => {
        const checarAceite = async () => {
            const retorno = await verificarAceite();
            setAutorizadoAcessoAluno(retorno.Resultado);
            setMensagemAcessoAluno(retorno.Mensagem);
        };

        checarAceite();
    }, []);

    const exerciciosInfo = {
        roscaDireta: {
            nome: "Rosca Direta",
            descricao: "A rosca direta é um exercício de bíceps realizado com halteres. Mantenha os cotovelos fixos e suba o peso lentamente.",
            execucao: "https://musclewiki.com/pt-br/exercise/dumbbells/male/biceps/dumbbell-curl",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-side.mp4"
            ]
        },
        meioAgachamento: {
            nome: "Meio Agachamento",
            descricao: "O meio agachamento fortalece quadríceps e glúteos. Desça até a metade da amplitude, mantendo a postura ereta.",
            execucao: "https://musclewiki.com/pt-br/exercise/barbell/male/lowerback/barbell-low-bar-squat",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-low-bar-squat-side.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-low-bar-squat-front.mp4"
            ]
        },
        supinoRetoBanco: {
            nome: "Supino Reto no Banco",
            descricao: "Trabalha o peitoral, ombros e tríceps. Execute deitado no banco, empurrando a barra para cima e controlando na descida.",
            execucao: "https://musclewiki.com/pt-br/exercise/barbell/male/chest/barbell-bench-press",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-side_KciuhbB.mp4"
            ]
        },
        tricepsCordaPoliaAlta: {
            nome: "Tríceps Corda na Polia Alta",
            descricao: "Focado nos tríceps. Estenda os braços para baixo separando a corda no final do movimento, mantendo os cotovelos fixos.",
            execucao: "https://musclewiki.com/pt-br/exercise/cables/male/triceps/cable-rope-overhead-tricep-extension",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-overhead-tricep-extension-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-overhead-tricep-extension-side.mp4"
            ]
        },
        cadeiraFlexora: {
            nome: "Cadeira Flexora",
            descricao: "Fortalece a parte posterior das coxas. Flexione os joelhos trazendo o rolo para baixo em direção aos glúteos.",
            execucao: "https://musclewiki.com/pt-br/exercise/machine/male/hamstrings/seated-leg-curl",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Machine-seated-leg-curl-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Machine-seated-leg-curl-side.mp4"
            ]
        },
        levantamentoTerra: {
            nome: "Levantamento Terra",
            descricao: "Um dos principais exercícios compostos, trabalha pernas, glúteos, lombar e core. Mantenha a coluna reta durante a execução.",
            execucao: "https://musclewiki.com/pt-br/exercise/barbell/male/traps-middle/barbell-deadlift",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-deadlift-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-deadlift-side.mp4"
            ]
        },
        agachamentoBulgaro: {
            nome: "Agachamento Búlgaro com Halteres",
            descricao: "Com um pé apoiado atrás, desça flexionando o joelho da frente, segurando halteres nas mãos para resistência.",
            execucao: "https://musclewiki.com/pt-br/exercise/dumbbells/male/glutes/dumbbell-assisted-bulgarian-split-squat",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-assisted-bulgarian-split-squat-side.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-assisted-bulgarian-split-squat-front.mp4"
            ]
        },
        agachamentoSumo: {
            nome: "Agachamento Sumô com Halteres",
            descricao: "Exercício para pernas e glúteos. Segure o halter entre as pernas, mantenha os pés afastados e agache mantendo postura ereta.",
            execucao: "https://musclewiki.com/pt-br/exercise/dumbbells/male/lowerback/dumbbell-sumo-squat",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-sumo-squat-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-sumo-squat-side.mp4"
            ]
        }
    };

    const exercicioSelecionado = exerciciosInfo[exercise];

    // Landmarks
    const lmks = {
        // Membros superiores
        'RIGHT_SHOULDER': 11,
        'LEFT_SHOULDER': 12,
        'RIGHT_ELBOW': 13,
        'LEFT_ELBOW': 14,
        'RIGHT_WRIST': 15,
        'LEFT_WRIST': 16,

        // Membros inferiores
        'RIGHT_HIP': 23,
        'LEFT_HIP': 24,
        'RIGHT_KNEE': 25,
        'LEFT_KNEE': 26,
        'RIGHT_ANKLE': 27,
        'LEFT_ANKLE': 28
    };

    const exercicios = {
        // nomeExercicio: {
        //     pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST'] --- pontos utilizados no exercício
        //     calcular: (landmarks, stageRef, setCounter) => {}, --- lógica do exercício
        //     desenhar: (canvasCtx, canvasElement, landmarks, angulo) => {} --- desenha no canvas
        // }
        roscaDireta: {
            pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST', 'RIGHT_SHOULDER', 'RIGHT_ELBOW', 'RIGHT_WRIST'],
            limites: { min: 30, max: 145 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw, rs, re, rw] = [12, 14, 16, 11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;


                if (angEsq >= exercicios.roscaDireta.limites.max && angDir >= exercicios.roscaDireta.limites.max) stageRef.current = 'baixo';
                if (angEsq <= exercicios.roscaDireta.limites.min && angDir <= exercicios.roscaDireta.limites.min && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.roscaDireta.limites);

                return { angEsq, angDir, media };
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulos) => {
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#00FF00';

                const lElbow = landmarks[14];
                canvasCtx.fillText(`${angulos.angEsq.toFixed(2)}°`, lElbow.x * canvasElement.width + 10, lElbow.y * canvasElement.height - 10);

                const rElbow = landmarks[13];
                canvasCtx.fillText(`${angulos.angDir.toFixed(2)}°`, rElbow.x * canvasElement.width + 10, rElbow.y * canvasElement.height - 10);
            }
        },

        meioAgachamento: {
            pontos: ['LEFT_HIP', 'LEFT_KNEE', 'LEFT_ANKLE', 'RIGHT_HIP', 'RIGHT_KNEE', 'RIGHT_ANKLE'],
            limites: { min: 100, max: 170 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [lh, lk, la, rh, rk, ra] = [24, 26, 28, 23, 25, 27].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(lh, lk, la);
                const angDir = calcularAngulo(rh, rk, ra);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= exercicios.meioAgachamento.limites.max && angDir >= exercicios.meioAgachamento.limites.max) stageRef.current = 'baixo';
                if (angEsq <= exercicios.meioAgachamento.limites.min && angDir <= exercicios.meioAgachamento.limites.min && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.meioAgachamento.limites);

                return { angEsq, angDir, media };
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulos) => {
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#00FF00';

                const lKnee = landmarks[26];
                canvasCtx.fillText(`${angulos.angEsq.toFixed(2)}°`, lKnee.x * canvasElement.width + 10, lKnee.y * canvasElement.height - 10);

                const rKnee = landmarks[25];
                canvasCtx.fillText(`${angulos.angDir.toFixed(2)}°`, rKnee.x * canvasElement.width + 10, rKnee.y * canvasElement.height - 10);
            }
        },

        supinoRetoBanco: {
            pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST', 'RIGHT_SHOULDER', 'RIGHT_ELBOW', 'RIGHT_WRIST'],
            limites: { min: 0, max: 90 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw, rs, re, rw] = [12, 14, 16, 11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;


                if (angEsq >= exercicios.supinoRetoBanco.limites.max && angDir >= exercicios.supinoRetoBanco.limites.max) stageRef.current = 'baixo';
                if (angEsq <= exercicios.supinoRetoBanco.limites.min && angDir <= exercicios.supinoRetoBanco.limites.min && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.supinoRetoBanco.limites);

                return { angEsq, angDir, media };
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulos) => {
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#00FF00';

                const lElbow = landmarks[14];
                canvasCtx.fillText(`${angulos.angEsq.toFixed(2)}°`, lElbow.x * canvasElement.width + 10, lElbow.y * canvasElement.height - 10);

                const rElbow = landmarks[13];
                canvasCtx.fillText(`${angulos.angDir.toFixed(2)}°`, rElbow.x * canvasElement.width + 10, rElbow.y * canvasElement.height - 10);
            }
        },

        tricepsCordaPoliaAlta: {
            pontos: ['LEFT_WRIST', 'LEFT_ELBOW', 'LEFT_SHOULDER', 'RIGHT_WRIST', 'RIGHT_ELBOW', 'RIGHT_SHOULDER'],
            limites: { min: 160, max: 175 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [lw, le, ls, rw, re, rs] = [15, 13, 11, 16, 14, 12].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= exercicios.tricepsCordaPoliaAlta.limites.max && angDir >= exercicios.tricepsCordaPoliaAlta.limites.max) stageRef.current = 'cima';
                if (angEsq <= exercicios.tricepsCordaPoliaAlta.limites.min && angDir <= exercicios.tricepsCordaPoliaAlta.limites.min && stageRef.current === 'cima') {
                    stageRef.current = 'baixo';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.tricepsCordaPoliaAlta.limites);

                return { angEsq, angDir, media };
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulos) => {
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#FFD700';

                const lElbow = landmarks[13];
                canvasCtx.fillText(`${angulos.angEsq.toFixed(2)}°`, lElbow.x * canvasElement.width + 10, lElbow.y * canvasElement.height - 10);

                const rElbow = landmarks[14];
                canvasCtx.fillText(`${angulos.angDir.toFixed(2)}°`, rElbow.x * canvasElement.width + 10, rElbow.y * canvasElement.height - 10);
            }
        },

        cadeiraFlexora: {
            pontos: ['LEFT_HIP', 'LEFT_KNEE', 'LEFT_ANKLE', 'RIGHT_HIP', 'RIGHT_KNEE', 'RIGHT_ANKLE'],
            limites: { min: 90, max: 170 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [lh, lk, la, rh, rk, ra] = [23, 25, 27, 24, 26, 28].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(lh, lk, la);
                const angDir = calcularAngulo(rh, rk, ra);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= exercicios.tricepsCordaPoliaAlta.limites.max && angDir >= exercicios.tricepsCordaPoliaAlta.limites.max) stageRef.current = 'estendido';
                if (angEsq <= exercicios.tricepsCordaPoliaAlta.limites.min && angDir <= exercicios.tricepsCordaPoliaAlta.limites.min && stageRef.current === 'estendido') {
                    stageRef.current = 'flexionado';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.cadeiraFlexora.limites);

                return { angEsq, angDir, media };
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulos) => {
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#FF4500';

                const lKnee = landmarks[25];
                canvasCtx.fillText(`${angulos.angEsq.toFixed(2)}°`, lKnee.x * canvasElement.width + 10, lKnee.y * canvasElement.height - 10);

                const rKnee = landmarks[26];
                canvasCtx.fillText(`${angulos.angDir.toFixed(2)}°`, rKnee.x * canvasElement.width + 10, rKnee.y * canvasElement.height - 10);
            }
        }

        // Adicionar novos exercícios abaixo no mesmo padrão...
    };

    const pontoVisivel = (landmarks, index) =>
        landmarks[index] && landmarks[index].visibility > 0.5;

    const calcularAngulo = (a, b, c) => {
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
        let angulo = Math.abs(radians * 180.0 / Math.PI);
        return angulo > 180 ? 360 - angulo : angulo;
    };

    const analisarExercicio = useCallback((landmarks, canvasCtx, canvasElement) => {
        const ex = exercicios[exercise];
        if (!ex) return;

        // Verifica se todos os pontos necessários estão visíveis
        const lmkIndexes = ex.pontos.map(p => lmks[p]);
        if (!lmkIndexes.every(i => pontoVisivel(landmarks, i))) return;

        const resultado = ex.calcular(landmarks, stageRef, setCounter);
        setAngle(resultado.media || resultado); // ajusta para casos com média ou único ângulo
        ex.desenhar(canvasCtx, canvasElement, landmarks, resultado);
    }, [exercise]);

    const onResults = useCallback((results) => {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.poseLandmarks) {
            window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#0051ff', lineWidth: 4 });
            window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 4 });
            analisarExercicio(results.poseLandmarks, canvasCtx, canvasElement);
        }

        canvasCtx.restore();
    }, [analisarExercicio]);

    const setupCamera = async () => {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: window.innerWidth }, height: { ideal: window.innerHeight } },
            audio: false
        });
        video.srcObject = stream;
        await video.play().catch(console.error);

        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const toggleCamera = async () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        const novoFacingMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(novoFacingMode);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: novoFacingMode },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        } catch (err) {
            console.error("Erro ao alternar câmera:", err);
        }
    };

    const start = async () => {
        await setupCamera();

        startTimeRef.current = Date.now();
        iniciarTimer();

        reset();

        const pose = new window.Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        pose.onResults(onResults);
        poseRef.current = pose;

        const detect = async () => {
            await pose.send({ image: videoRef.current });
            rafRef.current = requestAnimationFrame(detect);
        };
        detect();
        setIsRunning(true);
    };

    const stop = () => {
        cancelAnimationFrame(rafRef.current);
        poseRef.current?.close();
        poseRef.current = null;
        setIsRunning(false);
    };

    const reset = () => {
        setCounter(0);
        setAngle(0);
        stageRef.current = '---';
    };

    const handleStart = () => {
        start();
    };

    const iniciarTimer = () => {
        setShowModal(true);
        setContador(5);
        let timer = setInterval(() => {
            setContador(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowModal(false);
                    setMostrarStatus(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    };

    const handleSalvarResultados = async (quantidadeRepeticoes, porcentagemAcertos) => {
        const idUser = localStorage.getItem("@IdUser_APE");

        let tempoExecutado = "00:00:00";
        if (startTimeRef.current) {
            const diffMs = Date.now() - startTimeRef.current;
            const totalSec = Math.floor(diffMs / 1000);
            const hours = String(Math.floor(totalSec / 3600)).padStart(2, "0");
            const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
            const seconds = String(totalSec % 60).padStart(2, "0");
            tempoExecutado = `${hours}:${minutes}:${seconds}`;
        }

        const dto = {
            nome: exercicioSelecionado?.nome || exercise,
            quantidadeRepeticoes,
            porcentagemAcertos,
            tempoExecutado,
            observacoesAluno: "",
            observacoesPersonal: "",
            idAluno: idUser,
        };

        try {
            const response = await api.post("/Exercicio/salvarResultados", dto);

            if (response.status === 200) {
                setMensagemAcao("Resultados salvos com sucesso!");
                setShowModalFinal(true);
            } else {
                setMensagemAcao("Falha ao salvar resultados!");
            }
        } catch (error) {
            setMensagemAcao("Erro de conexão com o servidor!");
        }
    };

    const handleLimparResultados = () => {
        reset();
        setMensagemAcao('Resultados atuais limpos!');
        setShowModalLimpar(true);
    };

    const incrementarContador = (setCounter, stop) => {
        setCounter(prev => {
            const novoValor = prev + 1;
            if (novoValor === 10) {
                stop();

                const erros = errosRef.current;
                const sucesso = ((10 - erros) / 10) * 100;
                setMensagemSucesso(`Taxa de sucesso: ${sucesso}%`);
                setShowModalFinal(true);
                handleSalvarResultados(`${novoValor}`, `${sucesso}`);
            }
            return novoValor;
        });
    };

    const validarExecucao = (angulo, { min, max }) => {
        const tolerancia = (max * 20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)
        const dentroRange = angulo >= (min - tolerancia) && angulo <= (max + tolerancia);
        if (dentroRange) {
            acertosRef.current += 1;
        } else {
            if (errosRef.current < 10) {

                errosRef.current += 1;
                console.log(errosRef.current);
            }
        }

        if (angulo < (min - tolerancia)) {
            const msgFeedback = `Flexione no máximo até ${min - tolerancia}°.`;
            setFeedback(msgFeedback);
            falar(msgFeedback);
        }
        if (angulo > (max + tolerancia)) {
            const msgFeedback = `Estenda no máximo até ${max + tolerancia}°.`;
            setFeedback(msgFeedback);
            falar(msgFeedback);
        }
    };

    const handleCloseModalLimpar = () => {
        setShowModalLimpar(false);
    };

    const handleCloseModalFinal = () => {
        setShowModalFinal(false);
        navigate(0); // recarrega a mesma tela
    };

    let ultimaMensagem = "";
    let timeoutFala = null;

    function falar(texto) {
        if ("speechSynthesis" in window) {
            if (texto !== ultimaMensagem) {
                ultimaMensagem = texto;
                clearTimeout(timeoutFala);
                timeoutFala = setTimeout(() => { ultimaMensagem = ""; }, 5000);
                const utterance = new SpeechSynthesisUtterance(texto);
                utterance.lang = "pt-BR";
                window.speechSynthesis.speak(utterance);
            }
        }
    }


    useEffect(() => {
        return () => stop();
    }, []);

    return {
        autorizadoAcessoAluno,
        mensagemAcessoAluno,
        canvasRef,
        videoRef,
        counter,
        angle,
        isRunning,
        exercicioSelecionado,
        exercise,
        setExercise,
        showModal,
        setShowModal,
        showModalLimpar,
        showModalFinal,
        handleCloseModalLimpar,
        handleCloseModalFinal,
        mensagemSucesso,
        mensagemAcao,
        contador,
        mostrarStatus,
        start,
        stop,
        reset,
        toggleCamera,
        handleStart,
        handleLimparResultados,
        feedback
    };
}
