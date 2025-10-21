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
        exercise, setExercise, showModal, setShowModal, showModalInstrucoes,
        exercicioSelecionado, contador, mostrarStatus, showModalAviso,
        handleStart, handleLimparResultados, toggleCamera, handleCloseModalInstrucoes,
        showModalLimpar, handleCloseModalLimpar, handleCloseModalAviso,
        showModalFinal, handleCloseModalFinal, autorizadoAcessoAluno,
        mensagemSucesso, mensagemAcao, mensagemAcessoAluno, feedback
    } = usePoseDetection();

    if (autorizadoAcessoAluno === null) return <Loading />;
    if (autorizadoAcessoAluno === false) {
        return (
            <div className="container">
                <Title titulo="Não foi possível acessar o conteúdo dessa tela" titulo2={mensagemAcessoAluno} />
                <Button
                    label="Voltar"
                    onClick={() => navigate("/minha-conta")}
                    variant="info"
                />
            </div>
        );
    }

    return (
        <div className="container">
            {mostrarStatus && (
                <InfoBox counter={counter} angle={angle} feedback={feedback} />
            )}

            <Modal
                isOpen={showModalInstrucoes}
                onClose={handleCloseModalInstrucoes}
            >
                <Title titulo={`Como usar a tela de exercício`} />
                <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>Antes de começar, siga estes passos:</p>

                    <ol className="list-decimal list-inside space-y-2">
                        <li>Garanta que sua câmera esteja ligada e visível no navegador.</li>
                        <li>Escolha o exercício desejado (como agachamento ou rosca direta).</li>
                        <li>Confira na parte inferior da tela uma demonstração do exercício selecionado.</li>
                        <li>Pressione <strong>“Iniciar avaliação”</strong> para começar a detecção.</li>
                        <li>Posicione o corpo em frente à câmera, com boa iluminação.</li>
                        <li>Execute o movimento corretamente — o contador aumentará automaticamente.</li>
                        <li>Ao finalizar, poderá ver o resultado da análise.</li>
                    </ol>

                    <p className="mt-4 text-sm text-gray-500">
                        Dica: mantenha-se centralizado e evite movimentos fora do campo da câmera.
                    </p>
                </div>

                <Button label="Entendi" onClick={handleCloseModalInstrucoes} variant="success" />
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Title titulo={'Prepare-se!'} titulo2={`O treino vai começar!`} />
                <div style={{ textAlign: "center" }}>
                    <label style={{ color: "#00994d", fontSize: "100px", fontWeight: "bold" }}>{contador}</label>
                </div>
            </Modal>

            <Modal isOpen={showModalFinal} onClose={handleCloseModalFinal}>
                <Title titulo={mensagemAcao} titulo2={mensagemSucesso} />
                <Link to="/historico-exercicios" className="btn-avaliacao">Consultar Histórico</Link>
            </Modal>

            <Modal isOpen={showModalAviso} onClose={handleCloseModalAviso}>
                <Title titulo={mensagemAcao} />
                <Button label="Ok" onClick={handleCloseModalAviso} variant="success" />
            </Modal>

            <Modal isOpen={showModalLimpar} onClose={handleCloseModalLimpar}>
                <Title titulo={mensagemAcao} />
                <Button label="Ok" onClick={handleCloseModalLimpar} variant="success" />
            </Modal>

            <VideoCanvas canvasRef={canvasRef} videoRef={videoRef} />

            {!isRunning && (
                <>
                    <SelectExercicio selectedExercise={exercise} onChange={setExercise} />
                    <Button
                        label="Iniciar Avaliação"
                        onClick={handleStart}
                        variant="success"
                    />
                </>
            )}

            {mostrarStatus && (
                <div className="botoes-resultado">
                    <Button
                        label="Inverter Câmera"
                        onClick={toggleCamera}
                        variant="secondary"
                        className="btn-inverter-camera"
                    />
                    <br></br>
                    <Button
                        label="Limpar Resultados"
                        onClick={handleLimparResultados}
                        variant="secondary"
                    />
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
                                    style={{ marginTop: "10px", borderRadius: "12px", cursor: 'pointer' }}
                                    onClick={() => window.open(exercicioSelecionado.execucao, '_blank')}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
