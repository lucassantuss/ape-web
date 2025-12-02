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
    const pontosVisiveisRef = useRef(false);

    const [counter, setCounter] = useState(0);
    const [angle, setAngle] = useState(0);
    const [exercise, setExercise] = useState(initialExercise);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(null);
    const [facingMode, setFacingMode] = useState("user");

    const [showModal, setShowModal] = useState(false);
    const [showModalAviso, setShowModalAviso] = useState(false);
    const [showModalInstrucoes, setShowModalInstrucoes] = useState(true);
    const [showModalLimpar, setShowModalLimpar] = useState(false);
    const [showModalFinal, setShowModalFinal] = useState(false);
    const [contador, setContador] = useState(0);
    const [mostrarStatus, setMostrarStatus] = useState(false);
    const [mensagemAcao, setMensagemAcao] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [feedback, setFeedback] = useState("");
    const [trava, setTrava] = useState(false);

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
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-low-bar-squat-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-low-bar-squat-side.mp4"
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
        tricepsPoliaCorda: {
            nome: "Tríceps na Polia com Corda",
            descricao: "O cabo deve ser ajustado até o topo da máquina. Mantenha a parte superior do braço colada ao corpo. Estenda os cotovelos até sentir a contração nos tríceps.",
            execucao: "https://musclewiki.com/pt-br/exercise/cable-rope-pushdown",
            videos: [
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-push-down-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-push-down-side.mp4"
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
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-assisted-bulgarian-split-squat-front.mp4",
                "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-assisted-bulgarian-split-squat-side.mp4"
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
            limites: { min: 35, max: 145 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw, rs, re, rw] = [12, 14, 16, 11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                const min = exercicios.roscaDireta.limites.min;
                const max = exercicios.roscaDireta.limites.max;
                const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

                const limiteMin = min - (min * tolerancia); // ponto baixo aceitável
                const limiteMax = max + (max * tolerancia); // ponto alto aceitável

                // Verifica se está no ponto baixo
                const noPontoBaixo = angEsq >= (limiteMax - (limiteMax - max)) && angDir >= (limiteMax - (limiteMax - max)); 
                // Verifica se está no ponto alto
                const noPontoAlto = angEsq <= (min + (min - limiteMin)) && angDir <= (min + (min - limiteMin));

                if (noPontoBaixo) {
                    stageRef.current = 'baixo';
                }

                if (noPontoAlto && stageRef.current === 'baixo') {
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

                const min = exercicios.meioAgachamento.limites.min;
                const max = exercicios.meioAgachamento.limites.max;
                const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

                const limiteMin = min - (min * tolerancia); // ponto baixo aceitável
                const limiteMax = max + (max * tolerancia); // ponto alto aceitável

                // Verifica se está no ponto baixo
                const noPontoBaixo = angEsq >= (limiteMax - (limiteMax - max)) && angDir >= (limiteMax - (limiteMax - max)); 
                // Verifica se está no ponto alto
                const noPontoAlto = angEsq <= (min + (min - limiteMin)) && angDir <= (min + (min - limiteMin));

                if (noPontoBaixo) {
                    stageRef.current = 'baixo';
                }

                if (noPontoAlto && stageRef.current === 'baixo') {
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
            limites: { min: 90, max: 180 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw, rs, re, rw] = [12, 14, 16, 11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                const min = exercicios.supinoRetoBanco.limites.min;
                const max = exercicios.supinoRetoBanco.limites.max;
                const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

                const limiteMin = min - (min * tolerancia); // ponto baixo aceitável
                const limiteMax = max + (max * tolerancia); // ponto alto aceitável

                // Verifica se está no ponto baixo
                const noPontoBaixo = angEsq >= (limiteMax - (limiteMax - max)) && angDir >= (limiteMax - (limiteMax - max)); 
                // Verifica se está no ponto alto
                const noPontoAlto = angEsq <= (min + (min - limiteMin)) && angDir <= (min + (min - limiteMin));

                if (noPontoBaixo) {
                    stageRef.current = 'baixo';
                }

                if (noPontoAlto && stageRef.current === 'baixo') {
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

        tricepsPoliaCorda: {
            pontos: ['LEFT_WRIST', 'LEFT_ELBOW', 'LEFT_SHOULDER', 'RIGHT_WRIST', 'RIGHT_ELBOW', 'RIGHT_SHOULDER'],
            limites: { min: 160, max: 175 },
            calcular: (landmarks, stageRef, setCounter) => {
                const [lw, le, ls, rw, re, rs] = [15, 13, 11, 16, 14, 12].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(ls, le, lw);
                const angDir = calcularAngulo(rs, re, rw);
                const media = (angEsq + angDir) / 2;

                const min = exercicios.tricepsPoliaCorda.limites.min;
                const max = exercicios.tricepsPoliaCorda.limites.max;
                const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

                const limiteMin = min - (min * tolerancia); // ponto baixo aceitável
                const limiteMax = max + (max * tolerancia); // ponto alto aceitável

                // Verifica se está no ponto baixo
                const noPontoBaixo = angEsq >= (limiteMax - (limiteMax - max)) && angDir >= (limiteMax - (limiteMax - max)); 
                // Verifica se está no ponto alto
                const noPontoAlto = angEsq <= (min + (min - limiteMin)) && angDir <= (min + (min - limiteMin));

                if (noPontoBaixo) {
                    stageRef.current = 'cima';
                }

                if (noPontoAlto && stageRef.current === 'cima') {
                    stageRef.current = 'baixo';
                    incrementarContador(setCounter, stop);
                }
                validarExecucao(media, exercicios.tricepsPoliaCorda.limites);

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
            limites: { min: 110, max: 170 }, // 180 - 90
            calcular: (landmarks, stageRef, setCounter) => {
                const [lh, lk, la, rh, rk, ra] = [24, 26, 28, 23, 25, 27].map(i => [landmarks[i].x, landmarks[i].y]);
                const angEsq = calcularAngulo(lh, lk, la);
                const angDir = calcularAngulo(rh, rk, ra);
                const media = (angEsq + angDir) / 2;

                const min = exercicios.cadeiraFlexora.limites.min;
                const max = exercicios.cadeiraFlexora.limites.max;
                const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

                const limiteMin = min - (min * tolerancia); // ponto baixo aceitável
                const limiteMax = max + (max * tolerancia); // ponto alto aceitável

                // Verifica se está no ponto baixo
                const noPontoBaixo = angEsq >= (limiteMax - (limiteMax - max)) && angDir >= (limiteMax - (limiteMax - max)); 
                // Verifica se está no ponto alto
                const noPontoAlto = angEsq <= (min + (min - limiteMin)) && angDir <= (min + (min - limiteMin));

                if (noPontoBaixo) {
                    stageRef.current = 'estendido';
                }

                if (noPontoAlto && stageRef.current === 'estendido') {
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
        if (!lmkIndexes.every(i => pontoVisivel(landmarks, i))) {
            pontosVisiveisRef.current = false;
            const msgFeedback = 'enquadre os pontos do corpo na tela';
            setFeedback(msgFeedback);
            return;
        }

        pontosVisiveisRef.current = true;

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
        const isMobile = window.innerWidth <= 768;

        const constraints = {
            video: {
                facingMode, // "user" ou "environment"
                aspectRatio: isMobile ? 16 / 9 : 4 / 3,
                width: { ideal: isMobile ? 1280 : 960 },
                height: { ideal: isMobile ? 720 : 720 }
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await video.play().catch(console.error);

        const canvas = canvasRef.current;
        if (canvas) {
            const largura = window.innerWidth;
            const altura = isMobile ? largura * (9 / 16) : largura * (3 / 4);
            canvas.width = largura;
            canvas.height = altura;
        }
    };

    const toggleCamera = async () => {
        // Cancela o loop atual antes de parar a câmera
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // Para a câmera atual
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        const novoFacingMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(novoFacingMode);

        try {
            const isMobile = window.innerWidth <= 768;

            const constraints = {
                video: {
                    facingMode: novoFacingMode,
                    aspectRatio: isMobile ? 16 / 9 : 4 / 3,
                    width: { ideal: isMobile ? 1280 : 960 },
                    height: { ideal: isMobile ? 720 : 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            const canvas = canvasRef.current;
            if (canvas) {
                const largura = window.innerWidth;
                const altura = isMobile ? largura * (9 / 16) : largura * (3 / 4);
                canvas.width = largura;
                canvas.height = altura;
            }

            // Reinicia o loop com o novo stream
            if (poseRef.current) {
                const detect = async () => {
                    if (!videoRef.current || videoRef.current.readyState < 2) return;
                    try {
                        await poseRef.current.send({ image: videoRef.current });
                    } catch (err) {
                        console.error("Erro no loop do Pose:", err);
                    }
                    rafRef.current = requestAnimationFrame(detect);
                };
                detect();
            }

        } catch (err) {
            console.error("Erro ao alternar câmera:", err);
        }
    };

    const start = async () => {
        try {
            // Verifica se há câmera disponível
            const devices = await navigator.mediaDevices.enumerateDevices();
            const temCamera = devices.some(d => d.kind === "videoinput");

            if (!temCamera) {
                // se não tiver câmera, abre modal e cancela execução
                setMensagemAcao("Nenhuma câmera foi encontrada no dispositivo.");
                setShowModalAviso(true);
                return;
            }
            else {
                await setupCamera();

                startTimeRef.current = Date.now();
                iniciarTimer();

                reset();

                const pose = new window.Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
                pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
                pose.onResults(onResults);
                poseRef.current = pose;

                const detect = async () => {
                    if (!videoRef.current || videoRef.current.readyState < 2) return;
                    try {
                        await pose.send({ image: videoRef.current });
                    } catch (err) {
                        console.error("Erro no loop do Pose:", err);
                    }
                    rafRef.current = requestAnimationFrame(detect);
                };
                detect();
                setIsRunning(true);
            }
        }
        catch {
            setMensagemAcao("Não foi possível acessar a câmera.");
            setShowModalAviso(true);
        }
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
        unlockSpeech(() => start());
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
        if (!pontosVisiveisRef.current) return;

        const tolerancia = (20) / 100; //Tolerância baseada na ROM (angulo máximo de cada exercício)

        const minInferior = min - (min * tolerancia);
        const maxSuperior = max + (max * tolerancia);

        const dentroFaixaMin = angulo >= minInferior && angulo <= min;
        const dentroFaixaMax = angulo >= max && angulo <= maxSuperior;

        const dentroRange = dentroFaixaMin || dentroFaixaMax;

        if (dentroRange) {
            acertosRef.current += 1;
            const msgFeedback = 'continue assim!';
            setFeedback(msgFeedback);
        } else {
            if (angulo < minInferior) {
                if (trava == false && errosRef.current < 10) {
                    errosRef.current += 1;
                    setTrava(true);
                }
                const msgFeedback = `flexione no máximo até ${minInferior}°.`;
                setFeedback(msgFeedback);
                falar(msgFeedback);
            }
            if (angulo > maxSuperior) {
                if (trava == true && errosRef.current < 10) {
                    errosRef.current += 1;
                    setTrava(false);
                }
                const msgFeedback = `estenda no máximo até ${maxSuperior}°.`;
                setFeedback(msgFeedback);
                falar(msgFeedback);
            }
        }
    };

    const handleCloseModalAviso = () => {
        setShowModalAviso(false);
    };

    const handleCloseModalInstrucoes = () => {
        setShowModalInstrucoes(false);
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

    const [speechUnlocked, setSpeechUnlocked] = useState(false);

    const unlockSpeech = (callback) => {
        if (speechUnlocked) {
            if (callback) callback();
            return;
        }

        try {
            const u = new SpeechSynthesisUtterance("");
            u.lang = "pt-BR";
            u.onend = () => {
                setSpeechUnlocked(true);
                if (callback) callback();
            };
            window.speechSynthesis.speak(u);
        } catch (e) {
            console.error("Erro ao desbloquear fala:", e);
            if (callback) callback();
        }
    };

    function falar(mensagem) {
        if (!("speechSynthesis" in window)) return;

        // evita repetir a mesma mensagem em loop
        if (mensagem === ultimaMensagem) return;

        // limpa timeout anterior
        if (timeoutFala) {
            clearTimeout(timeoutFala);
            timeoutFala = null;
        }

        const utterance = new SpeechSynthesisUtterance(mensagem);
        utterance.lang = "pt-BR";
        utterance.rate = 1.0;
        utterance.pitch = 1.1;

        window.speechSynthesis.speak(utterance);

        ultimaMensagem = mensagem;

        // libera para falar a mesma mensagem de novo só após alguns segundos
        timeoutFala = setTimeout(() => {
            ultimaMensagem = "";
        }, 12000);
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
        showModalAviso,
        showModalInstrucoes,
        setShowModal,
        showModalLimpar,
        showModalFinal,
        handleCloseModalAviso,
        handleCloseModalInstrucoes,
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
