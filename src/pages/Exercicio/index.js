import { usePoseDetection } from 'hooks/usePoseDetection';
import VideoCanvas from 'components/VideoCanvas';
import InfoBox from 'components/InfoBox';
import SelectExercicio from 'components/SelectExercicio';
import './Exercicio.css';

const exerciciosInfo = {
  roscaDireta: {
    nome: "Rosca Direta",
    descricao: "A rosca direta é um exercício de bíceps realizado com barra ou halteres. Mantenha os cotovelos fixos e suba o peso lentamente.",
    imagens: [
      "https://static1.minhavida.com.br/articles/28/af/90/ef/65ef2fafd8480cdibqbudriorcr3wdflcvylxsylx3bo-65eivbmdzes-kzmnxjxs-enswzgv0ycxejtiworoosmdjtfhryeoittuobpp-0dcd9uy5ict6-wn0scgyzcer4dh5-utdyttssmhcptipfb2gpyqamxafsu-orig-1-orig-1.",
    ]
  },
  meioAgachamento: {
    nome: "Meio Agachamento",
    descricao: "O meio agachamento fortalece quadríceps e glúteos. Desça até a metade da amplitude, mantendo a postura ereta.",
    imagens: [
      "/img/exercicios/meioAgachamento1.png",
      "/img/exercicios/meioAgachamento2.png"
    ]
  }
};

export default function Exercicio() {
  const {
    canvasRef,
    videoRef,
    counter,
    stageRef,
    angle,
    isRunning,
    exercise,
    setExercise,
    start
  } = usePoseDetection();

  const exercicioSelecionado = exerciciosInfo[exercise];

  return (
    <div className="container">
      <InfoBox counter={counter} stage={stageRef.current} angle={angle} />
      <VideoCanvas canvasRef={canvasRef} videoRef={videoRef} />

      <SelectExercicio selectedExercise={exercise} onChange={setExercise} />

      {!isRunning && (
        <button className="btn-avaliacao" onClick={start}>
          Iniciar Avaliação
        </button>
      )}

      {exercicioSelecionado && (
        <>
          <div className="exercicio-descricao">
            <h3>{exercicioSelecionado.nome}</h3>
            <p>{exercicioSelecionado.descricao}</p>
          </div>

          <div className="exercicio-imagens">
            {exercicioSelecionado.imagens.map((img, idx) => (
              <img key={idx} src={img} alt={`Exemplo ${exercise}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
