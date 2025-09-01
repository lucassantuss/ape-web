import InfoBox from 'components/InfoBox';
import Modal from 'components/Modal';
import SelectExercicio from 'components/SelectExercicio';
import Title from 'components/Title';
import VideoCanvas from 'components/VideoCanvas';
import { usePoseDetection } from 'pages/Exercicio/hooks/usePoseDetection';

import './Exercicio.css';

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

export default function Exercicio() {
    const {
        canvasRef, videoRef, counter, angle, isRunning,
        exercise, setExercise, showModal, setShowModal,
        contador, mostrarStatus, resultados, stageRef,
        handleStart, handleSalvarResultados, handleLimparResultados
    } = usePoseDetection();

    const exercicioSelecionado = exerciciosInfo[exercise];

    return (
        <div className="container">
            {mostrarStatus && (
                <InfoBox counter={counter} stage={stageRef.current} angle={angle} />
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Title
                    titulo={'Prepare-se!'}
                    titulo2={`O treino vai começar!`}
                />
                <div style={{ textAlign: "center" }}>
                    <label style={{ color: "#00994d", fontSize: "100px", fontWeight: "bold" }}>{contador}</label>
                </div>

            </Modal>

            <VideoCanvas canvasRef={canvasRef} videoRef={videoRef} />

            {!isRunning && (
                <>
                    <SelectExercicio selectedExercise={exercise} onChange={setExercise} />
                    <button className="btn-avaliacao" onClick={handleStart}>
                        Iniciar Avaliação
                    </button>
                </>
            )}

            {mostrarStatus && (
                <div className="botoes-resultado">
                    <button className="btn-avaliacao" onClick={handleSalvarResultados}>
                        Salvar Resultados
                    </button>
                    <button className="btn-avaliacao" onClick={handleLimparResultados}>
                        Limpar Resultados
                    </button>
                </div>
            )}

            {exercicioSelecionado && (
                <>
                    <div className="exercicio-descricao">
                        <h3>{exercicioSelecionado.nome}</h3>
                        <p>{exercicioSelecionado.descricao}</p>
                    </div>

                    {exercicioSelecionado.videos && (
                        <div className="exercicio-videos">
                            {exercicioSelecionado.videos.map((video, idx) => (
                                <video
                                    key={idx}
                                    src={video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    width="100%"
                                    style={{ marginTop: "10px", borderRadius: "12px" }}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* <div className="exercicio-descricao">
                <h3>Histórico</h3>
                <ul>
                    {logs.map((log, idx) => (
                        <li key={idx}>
                            [{log.hora}] {log.status} - Rep {log.repeticao}
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}
