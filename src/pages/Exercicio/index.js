import InfoBox from 'components/InfoBox';
import Modal from 'components/Modal';
import SelectExercicio from 'components/SelectExercicio';
import Title from 'components/Title';
import VideoCanvas from 'components/VideoCanvas';
import { usePoseDetection } from 'pages/Exercicio/hooks/usePoseDetection';
import { Link, useNavigate } from 'react-router-dom';

import './Exercicio.css';
import Loading from 'components/Loading';
import Button from 'components/Button';

export default function Exercicio() {
    const navigate = useNavigate();

    const {
        canvasRef, videoRef, counter, angle, isRunning,
        exercise, setExercise, showModal, setShowModal,
        exercicioSelecionado, contador, mostrarStatus, resultados,
        handleStart, handleSalvarResultados, handleLimparResultados,
        showModalFinal, setShowModalFinal, handleCloseModalFinal,
        mensagemSucesso, mensagemAcao, autorizadoAcessoAluno
    } = usePoseDetection();

    if (autorizadoAcessoAluno === null) return <Loading />;
    if (autorizadoAcessoAluno === false) {
        return (
            <div className="container">
                <Title titulo="Não foi possível acessar o conteúdo dessa tela" titulo2="Seu personal ainda não aceitou seu vínculo como aluno. Aguarde o aceite da parte dele!" />
                <Button label="Voltar" onClick={() => navigate("/minha-conta")} />
            </div>
        );
    }

    return (
        <div className="container">
            {mostrarStatus && (
                <InfoBox counter={counter} angle={angle} />
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

            <Modal isOpen={showModalFinal} onClose={handleCloseModalFinal}>
                <Title titulo={mensagemAcao} titulo2={mensagemSucesso} />
                <Link to="/historico-exercicios" className="btn-avaliacao">Consultar Histórico</Link>
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
        </div>
    );
}
