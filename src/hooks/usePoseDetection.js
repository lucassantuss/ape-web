import { useEffect, useRef, useState, useCallback } from 'react';

export function usePoseDetection(initialExercise = 'roscaDireta') {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const poseRef = useRef(null);
    const rafRef = useRef(null);
    const stageRef = useRef('---');

    const [counter, setCounter] = useState(0);
    const [angle, setAngle] = useState(0);
    const [exercise, setExercise] = useState(initialExercise);
    const [isRunning, setIsRunning] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [contador, setContador] = useState(0);
    const [mostrarStatus, setMostrarStatus] = useState(false);
    const [resultados, setResultados] = useState([]);

    // Landmarks
    const lmks = {
        'LEFT_SHOULDER': 11,
        // 'RIGHT_SHOULDER': 12,
        'LEFT_ELBOW': 13,
        // 'RIGHT_ELBOW': 14,
        'LEFT_WRIST': 15,
        // 'RIGHT_WRIST': 16,
        'LEFT_HIP': 24,
        'RIGHT_HIP': 23,
        'LEFT_KNEE': 26,
        'RIGHT_KNEE': 25,
        'LEFT_ANKLE': 28,
        'RIGHT_ANKLE': 27,
        // todo analisar o numero dos pontos certinho depois
        // adicionar outros conforme necessário
    };

    const exercicios = {
        // nomeExercicio: {
        //     pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST'] --- pontos utilizados no exercício
        //     calcular: (landmarks, stageRef, setCounter) => {}, --- lógica do exercício
        //     desenhar: (canvasCtx, canvasElement, landmarks, angulo) => {} --- desenha no canvas
        // }
        roscaDireta: {
            pontos: ['LEFT_SHOULDER', 'LEFT_ELBOW', 'LEFT_WRIST'],
            calcular: (landmarks, stageRef, setCounter) => {
                const [ls, le, lw] = [11, 13, 15].map(i => [landmarks[i].x, landmarks[i].y]);
                let angulo = calcularAngulo(ls, le, lw);

                if (angulo > 145) stageRef.current = 'baixo';
                if (angulo < 30 && stageRef.current === 'baixo') {
                    stageRef.current = 'cima';
                    setCounter(prev => prev + 1);
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
                    setCounter(prev => prev + 1);
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

    const start = async () => {
        await setupCamera();
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
        setShowModal(true);
        setContador(5);
        iniciarTimer();
    };

    const iniciarTimer = () => {
        let timer = setInterval(() => {
            setContador(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowModal(false);
                    setMostrarStatus(true);
                    start();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    };

    const handleSalvarResultados = () => {
        const resultadoAtual = {
            alunoNome: "Nome do Aluno", // substituir pelo valor real
            personalId: "ID Personal", // substituir pelo valor real
            repeticoes: counter,
            angulo: angle,
            estagio: stageRef.current,
            exercicio: exercise,
        };
        setResultados(prev => [...prev, resultadoAtual]);
        alert('Resultados salvos!');
    };

    const handleLimparResultados = () => {
        reset();
        setResultados([]);
        alert('Resultados atuais limpos!');
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
