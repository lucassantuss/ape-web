import { useEffect, useRef, useState, useCallback } from 'react';

export function usePoseDetection() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [counter, setCounter] = useState(0);
  const [angle, setAngle] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [exercise, setExercise] = useState('roscaDireta');

  const poseRef = useRef(null);
  const rafRef = useRef(null);
  const stageRef = useRef('---');

  const calcularAngulo = (a, b, c) => {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angulo = Math.abs(radians * 180.0 / Math.PI);
    return angulo > 180 ? 360 - angulo : angulo;
  };

  const valorPoseLandmark = (landmarks, index) => {
    if (!landmarks || landmarks.length <= index) return [0, 0];
    return [landmarks[index].x, landmarks[index].y];
  };

  const analisarExercicio = (landmarks, canvasCtx, canvasElement) => {
    const lmk = {
      LEFT_SHOULDER: 11, LEFT_ELBOW: 13, LEFT_WRIST: 15,
      LEFT_HIP: 24, LEFT_KNEE: 26, LEFT_ANKLE: 28,
      RIGHT_HIP: 23, RIGHT_KNEE: 25, RIGHT_ANKLE: 27
    };

    let anguloEsquerdo = 0;
    let anguloDireito = 0;

    if (exercise === 'roscaDireta') {
      const ls = valorPoseLandmark(landmarks, lmk.LEFT_SHOULDER);
      const le = valorPoseLandmark(landmarks, lmk.LEFT_ELBOW);
      const lw = valorPoseLandmark(landmarks, lmk.LEFT_WRIST);

      anguloEsquerdo = calcularAngulo(ls, le, lw);
      setAngle(anguloEsquerdo);

      if (anguloEsquerdo > 145) stageRef.current = 'baixo';
      if (anguloEsquerdo < 30 && stageRef.current === 'baixo') {
        stageRef.current = 'cima';
        setCounter((prev) => prev + 1);
      }

      const elbow = landmarks[lmk.LEFT_ELBOW];
      const x = elbow.x * canvasElement.width + 10;
      const y = elbow.y * canvasElement.height - 10;

      canvasCtx.font = '40px Arial';
      canvasCtx.fillStyle = '#00FF00';
      canvasCtx.fillText(`${anguloEsquerdo.toFixed(2)}°`, x, y);
    }

    if (exercise === 'meioAgachamento') {
      const lh = valorPoseLandmark(landmarks, lmk.LEFT_HIP);
      const lk = valorPoseLandmark(landmarks, lmk.LEFT_KNEE);
      const la = valorPoseLandmark(landmarks, lmk.LEFT_ANKLE);

      const rh = valorPoseLandmark(landmarks, lmk.RIGHT_HIP);
      const rk = valorPoseLandmark(landmarks, lmk.RIGHT_KNEE);
      const ra = valorPoseLandmark(landmarks, lmk.RIGHT_ANKLE);

      anguloEsquerdo = calcularAngulo(lh, lk, la);
      anguloDireito = calcularAngulo(rh, rk, ra);

      const media = (anguloEsquerdo + anguloDireito) / 2;
      setAngle(media);

      if (anguloEsquerdo >= 170 && anguloDireito >= 170) stageRef.current = 'baixo';
      if (anguloEsquerdo <= 100 && anguloDireito <= 100 && stageRef.current === 'baixo') {
        stageRef.current = 'cima';
        setCounter((prev) => prev + 1);
      }

      canvasCtx.font = '40px Arial';
      canvasCtx.fillStyle = '#00FF00';

      const lKnee = landmarks[lmk.LEFT_KNEE];
      canvasCtx.fillText(`${anguloEsquerdo.toFixed(2)}°`, lKnee.x * canvasElement.width + 10, lKnee.y * canvasElement.height - 10);

      const rKnee = landmarks[lmk.RIGHT_KNEE];
      canvasCtx.fillText(`${anguloDireito.toFixed(2)}°`, rKnee.x * canvasElement.width + 10, rKnee.y * canvasElement.height - 10);
    }
  };

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
  }, [exercise, stage]);

  const setupCamera = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight }
      },
      audio: false
    });

    video.srcObject = stream;
    await video.play().catch(console.error);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const start = async () => {
    await setupCamera();
    setCounter(0);
    stageRef.current = '---';
    setAngle(0);

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

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

  useEffect(() => {
    return () => {
      stop(); // cleanup
    };
  }, []);

  return {
    canvasRef,
    videoRef,
    counter,
    stage,
    angle,
    isRunning,
    exercise,
    setExercise,
    start,
    stop
  };
}
