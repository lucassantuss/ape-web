import { useState } from "react";
import { usePoseDetection } from 'hooks/usePoseDetection';
import VideoCanvas from 'components/VideoCanvas';
import InfoBox from 'components/InfoBox';
import SelectExercicio from 'components/SelectExercicio';
import './Exercicio.css';

const exerciciosInfo = {
  roscaDireta: {
    nome: "Rosca Direta",
    descricao: "A rosca direta é um exercício de bíceps realizado com halteres. Mantenha os cotovelos fixos e suba o peso lentamente.",
    imagens: [
      "https://static1.minhavida.com.br/articles/28/af/90/ef/65ef2fafd8480cdibqbudriorcr3wdflcvylxsylx3bo-65eivbmdzes-kzmnxjxs-enswzgv0ycxejtiworoosmdjtfhryeoittuobpp-0dcd9uy5ict6-wn0scgyzcer4dh5-utdyttssmhcptipfb2gpyqamxafsu-orig-1-orig-1.",
    ]
  },
  meioAgachamento: {
    nome: "Meio Agachamento",
    descricao: "O meio agachamento fortalece quadríceps e glúteos. Desça até a metade da amplitude, mantendo a postura ereta.",
    imagens: [
      "https://s2-oglobo.glbimg.com/yIDfd5JifQQU4giwWBGUP-MWd7Y=/0x0:620x422/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2023/9/q/8ycUMESSGuDiSMkVnIBg/exercicio-agachamento.jpg"
    ]
  },
  supinoReto: {
    nome: "Supino Reto no Banco",
    descricao: "Trabalha o peitoral, ombros e tríceps. Execute deitado no banco, empurrando a barra para cima e controlando na descida.",
    imagens: [
      "https://treinomestre.com.br/wp-content/uploads/2017/08/supino-fechado-cp.jpg"
    ]
  },
  tricepsCorda: {
    nome: "Tríceps Corda na Polia Alta",
    descricao: "Focado nos tríceps. Estenda os braços para baixo separando a corda no final do movimento, mantendo os cotovelos fixos.",
    imagens: [
      "https://treinomestre.com.br/wp-content/uploads/2017/09/tricepes-pulley-corda-polia--scaled.jpg"
    ]
  },
  cadeiraFlexora: {
    nome: "Cadeira Flexora",
    descricao: "Fortalece a parte posterior das coxas. Flexione os joelhos trazendo o rolo para baixo em direção aos glúteos.",
    imagens: [
      "https://static.wixstatic.com/media/2edbed_0a29f82196854ba8a840f903017100a5~mv2.jpg/v1/fill/w_615,h_755,al_c,q_85,enc_avif,quality_auto/2edbed_0a29f82196854ba8a840f903017100a5~mv2.jpg"
    ]
  },
  levantamentoTerra: {
    nome: "Levantamento Terra",
    descricao: "Um dos principais exercícios compostos, trabalha pernas, glúteos, lombar e core. Mantenha a coluna reta durante a execução.",
    imagens: [
      "https://static1.minhavida.com.br/articles/a1/32/ac/bd/lio-putrashutterstock-movimento-do-levantamento-terra-sumo-article_m-1.jpg"
    ]
  },
  agachamentoBulgaro: {
    nome: "Agachamento Búlgaro com Halteres",
    descricao: "Com um pé apoiado atrás, desça flexionando o joelho da frente, segurando halteres nas mãos para resistência.",
    imagens: [
      "https://static.strengthlevel.com/images/exercises/dumbbell-bulgarian-split-squat/dumbbell-bulgarian-split-squat-800.jpg"
    ]
  },
  agachamentoSumo: {
    nome: "Agachamento Sumô com Halteres",
    descricao: "Exercício para pernas e glúteos. Segure o halter entre as pernas, mantenha os pés afastados e agache mantendo postura ereta.",
    imagens: [
      "https://www.lyfta.app/_next/image?url=https%3A%2F%2Flyfta.app%2Fimages%2Fexercises%2F23221101.png&w=750&q=75"
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

  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [fonteGrande, setFonteGrande] = useState(false);

  const exercicioSelecionado = exerciciosInfo[exercise];

  const handleStart = () => {
    setMostrarStatus(true);
    start();
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
    setResultados([]);
    alert('Resultados atuais limpos!');
  };

  return (
    <div className="container">
      {mostrarStatus && (
        <InfoBox
          counter={counter}
          stage={stageRef.current}
          angle={angle}
          fonteGrande={fonteGrande}
        />
      )}

      <VideoCanvas canvasRef={canvasRef} videoRef={videoRef} />

      <SelectExercicio selectedExercise={exercise} onChange={setExercise} />

      {!isRunning && (
        <button className="btn-avaliacao" onClick={handleStart}>
          Iniciar Avaliação
        </button>
      )}

      {mostrarStatus && (
        <div className="botoes-resultado">
          <button className="btn-avaliacao" onClick={handleSalvarResultados}>
            Salvar Resultados
          </button>
          <button className="btn-avaliacao" onClick={handleLimparResultados}>
            Limpar Resultados
          </button>
          <button
            className="btn-avaliacao"
            onClick={() => setFonteGrande(prev => !prev)}
          >
            {fonteGrande ? 'Diminuir Fonte' : 'Aumentar Fonte'}
          </button>
        </div>
      )}

      {exercicioSelecionado && (
        <>
          <div className="exercicio-descricao">
            <h3>{exercicioSelecionado.nome}</h3>
            <p>{exercicioSelecionado.descricao}</p>
          </div>

          <div className="exercicio-imagens">
            {exercicioSelecionado.imagens.map((img, idx) => (
              <img key={idx} src={img} alt={`${exercicioSelecionado.nome}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
