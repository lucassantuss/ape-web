import { usePoseDetection } from 'hooks/usePoseDetection';
import VideoCanvas from 'components/VideoCanvas';
import InfoBox from 'components/InfoBox';
import SelectExercicio from 'components/SelectExercicio';
import './Exercicio.css';

export default function Exercicio() {
  const {
    canvasRef,
    videoRef,
    counter,
    stage,
    angle,
    isRunning,
    exercise,
    setExercise,
    start
  } = usePoseDetection();

  return (
    <div className="container">
      <InfoBox counter={counter} stage={stage} angle={angle} />
      <VideoCanvas canvasRef={canvasRef} videoRef={videoRef} />
      <SelectExercicio selectedExercise={exercise} onChange={setExercise} />
      {!isRunning && (
        <button className='btn-avaliacao' onClick={start}>Iniciar Avaliação</button>
      )}
    </div>
  );
}
