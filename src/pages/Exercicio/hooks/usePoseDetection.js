import { useEffect, useRef, useState, useCallback } from 'react';
import api from "services/api";

export function usePoseDetection(initialExercise = 'roscaDireta') {
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

    const [showModal, setShowModal] = useState(false);
    const [showModalFinal, setShowModalFinal] = useState(false);
    const [contador, setContador] = useState(0);
    const [mostrarStatus, setMostrarStatus] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [mensagemAcao, setMensagemAcao] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");

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
            pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST'],
            limites: { min: 30, max: 145 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw] = [11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                let angulo = calcularAngulo(ls, le, lw);

                if (angulo > 145) stageRef.current = 'baixo';
                if (angulo < 30 && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    validarExecucao(angulo, exercicios.roscaDireta.limites);
                    incrementarContador(setCounter, stop, handleSalvarResultados);
                }

                return angulo;
            },
            desenhar: (canvasCtx, canvasElement, landmarks, angulo) => {
                const elbow = landmarks[13];
                const x = elbow.x * canvasElement.width + 10;
                const y = elbow.y * canvasElement.height - 10;
                canvasCtx.font = '40px Arial';
                canvasCtx.fillStyle = '#00FF00';
                canvasCtx.fillText(`${angulo.toFixed(2)}°`, x, y);
            }
        },

        meioAgachamento: {
            pontos: ['LEFT_HIP', 'LEFT_KNEE', 'LEFT_ANKLE', 'RIGHT_HIP', 'RIGHT_KNEE', 'RIGHT_ANKLE'],
            calcular: (landmarks, stageRef, setCounter) => {
                const [lh, lk, la, rh, rk, ra] = [24, 26, 28, 23, 25, 27].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(lh, lk, la);
                const angDir = calcularAngulo(rh, rk, ra);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= 170 && angDir >= 170) stageRef.current = 'baixo';
                if (angEsq <= 100 && angDir <= 100 && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    incrementarContador(setCounter, stop, handleSalvarResultados);
                }

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
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw, rs, re, rw] = [12, 14, 16, 11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= 90 && angDir >= 90) stageRef.current = 'baixo';
                if (angEsq <= 0 && angDir <= 0 && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    incrementarContador(setCounter, stop, handleSalvarResultados);
                }

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
            calcular: (landmarks, stageRef, setCounter) => {
                const [lw, le, ls, rw, re, rs] = [15, 13, 11, 16, 14, 12].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                if (angEsq <= 160 && angDir <= 160) stageRef.current = 'cima';
                if (angEsq >= 175 && angDir >= 175 && stageRef.current === 'cima') {
                    stageRef.current = 'baixo';
                    incrementarContador(setCounter, stop, handleSalvarResultados);
                }

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
            calcular: (landmarks, stageRef, setCounter) => {
                const [lh, lk, la, rh, rk, ra] = [23, 25, 27, 24, 26, 28].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(lh, lk, la);
                const angDir = calcularAngulo(rh, rk, ra);
                const media = (angEsq + angDir) / 2;

                if (angEsq >= 170 && angDir >= 170) stageRef.current = 'estendido';
                if (angEsq <= 90 && angDir <= 90 && stageRef.current === 'estendido') {
                    stageRef.current = 'flexionado';
                    incrementarContador(setCounter, stop, handleSalvarResultados);
                }

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
            video: { facingMode: 'user', width: { ideal: window.innerWidth }, height: { ideal: window.innerHeight } },
            audio: false
        });
        video.srcObject = stream;
        await video.play().catch(console.error);

        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const calcularPorcentagemAcertos = (repeticoes, erros) => {
        const total = Number(repeticoes) || 0;
        const e = Number(erros) || 0;
        const acertos = Math.max(0, total - e);

        if (total === 0) return "0.00";

        const perc = (acertos / total) * 100;
        return perc.toFixed(2);
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

    const handleSalvarResultados = async () => {
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

        const porcentagemAcertos = calcularPorcentagemAcertos(counter, errosRef.current);

        const dto = {
            nome: exercise,
            // quantidadeRepeticoes: counter.toString(),
            quantidadeRepeticoes: '10',
            // porcentagemAcertos,
            porcentagemAcertos: '100,00',
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
            console.error("Erro ao salvar resultados:", error);
            setMensagemAcao("Erro de conexão com o servidor!");
        }
    };

    const handleLimparResultados = () => {
        reset();
        setResultados([]);
        setMensagemAcao('Resultados atuais limpos!');
        setShowModalFinal(true);
    };

    const incrementarContador = (setCounter, stop, handleSalvarResultados) => {
        setCounter(prev => {
            const novoValor = prev + 1;
            if (novoValor === 10) {
                stop();
                handleSalvarResultados();

                const erros = errosRef.current;
                const sucesso = ((10 - erros) / 10) * 100;
                setMensagemSucesso(`Taxa de sucesso: ${sucesso}%`);
                setShowModalFinal(true);

                // reset pro próximo treino
                errosRef.current = 0;
                acertosRef.current = 0;
            }
            return novoValor;
        });
    };


    const validarExecucao = (angulo, { min, max }) => {
        const tolerancia = 10;
        const dentroRange = angulo >= (min - tolerancia) && angulo <= (max + tolerancia);
        if (dentroRange) {
            acertosRef.current += 1;
        } else {
            errosRef.current += 1;
        }
    };


    useEffect(() => {
        return () => stop();
    }, []);

    return {
        canvasRef,
        videoRef,
        counter,
        angle,
        isRunning,
        exercise,
        setExercise,
        showModal,
        setShowModal,
        showModalFinal,
        setShowModalFinal,
        mensagemSucesso,
        mensagemAcao,
        contador,
        mostrarStatus,
        resultados,
        stageRef,
        start,
        stop,
        reset,
        handleStart,
        handleSalvarResultados,
        handleLimparResultados,
    };
}
