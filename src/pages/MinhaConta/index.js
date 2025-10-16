import { useAuthentication } from "context/Authentication";
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import ModalInfo from "components/ModalInfo";
import Loading from "components/Loading";
import SearchInput from "components/SearchInput";
import Select from "components/Select";
import Title from 'components/Title';
import useMinhaConta from 'pages/MinhaConta/hooks/useMinhaConta';

import './MinhaConta.css';

export default function MinhaConta() {
	const { signOut } = useAuthentication();

	const {
		editando,
		setDadosEditados,
		setEditando,
		showModalExcluir,
		setShowModalExcluir,
		showModalPersonal,
		setShowModalPersonal,
		dadosOriginais,
		dadosEditados,
		errors,
		categoriaCref,
		personais,
		pesquisa,
		redirectOnClose,
		modalInfoTitle,
		modalInfoMessage,
		showModalInfo,
		fecharModalInfo,
		handleChange,
		handleSalvar,
		handleExcluirConta,
		handleSelecionadoPersonal,
		handlePesquisaPersonal,
		loading,
		error,
		estados,
		cidades,
	} = useMinhaConta();

	if (loading) return <Loading />;
	if (error) return <Title titulo={"Erro ao carregar dados: " + error.message} />;
	if (!dadosEditados) return <Title titulo="Usuário não encontrado." />;

	return (
		<div className="minha-conta-container">
			<Title titulo="Minha Conta" />

			<div className="minha-conta-grid">
				{/* Campos comuns */}
				<div className="minha-conta-box left">
					<label>Nome:</label>
					{editando ? (
						<Input
							name="nome"
							value={dadosEditados.nome || ""}
							onChange={handleChange}
							error={errors.nome}
						/>
					) : (
						<p>{dadosEditados.nome}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>Email:</label>
					{editando ? (
						<Input
							name="email"
							value={dadosEditados.email || ""}
							onChange={handleChange}
							error={errors.email}
						/>
					) : (
						<p>{dadosEditados.email}</p>
					)}
				</div>

				<div className="minha-conta-box left">
					<label>Usuário:</label>
					{editando ? (
						<Input
							name="usuario"
							value={dadosEditados.usuario || ""}
							onChange={handleChange}
							error={errors.usuario}
						/>
					) : (
						<p>{dadosEditados.usuario}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>CPF:</label>
					{editando ? (
						<Input
							name="cpf"
							maxLength={14}
							value={dadosEditados.cpf || ""}
							onChange={handleChange}
							error={errors.cpf}
						/>
					) : (
						<p>{dadosEditados.cpf}</p>
					)}
				</div>

				{/* Campos específicos do Aluno */}
				{dadosEditados.tipo === 'aluno' && (
					<div className="minha-conta-box left">
						<label>Personal Vinculado:</label>
						{editando ? (
							<>
								<SearchInput
									label=""
									name="personal"
									value={dadosEditados.personal?.nomeCompleto || "Nenhum personal vinculado"}
									onChange={handleChange}
									placeholder="Pesquise seu personal"
									maxLength={255}
									error={errors.personal}
									onClick={() => setShowModalPersonal(true)}
									readOnly
								/>

								<Modal isOpen={showModalPersonal} onClose={() => setShowModalPersonal(false)}>
									<Input
										label="Pesquisar Personal"
										name="personal"
										value={pesquisa}
										onChange={handlePesquisaPersonal}
										placeholder="Digite para buscar personal"
										maxLength={255}
										error={errors.personal}
									/>
									<select
										className="selectPersonal"
										onChange={handleSelecionadoPersonal}
										value={dadosEditados.personal?.id || ""}
										style={{ margin: "0px" }}
									>
										<option value="">Selecione um personal</option>
										{personais
											.filter((p) =>
												p.nomeCompleto.toLowerCase().includes(pesquisa.toLowerCase())
											)
											.map((p) => (
												<option key={p.id} value={p.id}>
													{p.nomeCompleto}
												</option>
											))}
									</select>
								</Modal>
							</>
						) : (
							<p>{dadosEditados.personal?.nomeCompleto || "Nenhum personal vinculado"}</p>
						)}
					</div>
				)}

				{/* Campos específicos do PERSONAL */}
				{dadosEditados.tipo === "personal" && (
					<>
						<div className="minha-conta-box right">
							<label>Estado:</label>
							{editando ? (
								<Select
									label=""
									name="estado"
									value={dadosEditados.estado || ""}
									onChange={handleChange}
									options={estados}
									error={errors.estado}
								/>
							) : (
								<p>{dadosEditados.estado}</p>
							)}
						</div>

						<div className="minha-conta-box left">
							<label>Cidade:</label>
							{editando ? (
								<Select
									label=""
									name="cidade"
									value={dadosEditados.cidade || ""}
									onChange={handleChange}
									options={cidades}
									error={errors.cidade}
								/>
							) : (
								<p>{dadosEditados.cidade}</p>
							)}
						</div>

						<div className="minha-conta-box right" style={{ height: "135px", paddingTop: "17px" }}>
							<label style={{ marginBottom: "12px" }}>N° CREF (Conselho Regional de Educação Física):</label>
							{editando ? (
								<input
									className="input-cref numeroCref"
									id='numeroCref'
									type='text'
									name='numeroCref'
									value={dadosEditados.numeroCref}
									onChange={handleChange}
									placeholder='Digite seu número CREF'
									maxLength={6}
								/>
							) : (
								<div className="input-cref-group">
									<div className="input-cref-row">
										<input
											className="input-cref numeroCref"
											id='numeroCref'
											type='text'
											name='numeroCref'
											value={dadosEditados.numeroCref}
											onChange={handleChange}
											placeholder='Digite seu número CREF'
											maxLength={6}
											disabled
										/>

										<input
											className="input-cref categoriaCref"
											id="inputCategoriaCref"
											name="inputCategoriaCref"
											value={dadosEditados.categoriaCref}
											maxLength={1}
											disabled
										/>

										<input
											className="input-cref estado"
											id="inputEstado"
											name="inputEstado"
											value={dadosEditados.estado}
											maxLength={2}
											disabled
										/>
									</div>
									{errors.cref && <span className="error-message">{errors.cref}</span>}
								</div>
							)}
						</div>

						{editando ? (
							<div className="minha-conta-box left">
								<label>Sigla CREF:</label>
								<Input
									name="siglaCref"
									value={dadosEditados.siglaCref || ""}
									onChange={handleChange}
									error={errors.siglaCref}
									disabled={true}
								/>
							</div>
						) : (
							<></>
						)}

						{editando ? (
							<div className="minha-conta-box left">
								<label>Categoria Profissional CREF:</label>
								<Select
									label=""
									name="categoriaCref"
									value={dadosEditados.categoriaCref || ""}
									onChange={handleChange}
									options={categoriaCref}
									error={errors.categoriaCref}
								/>
							</div>
						) : (
							<></>
						)}
					</>
				)}
			</div>

			<div className="minha-conta-botoes">
				{editando ? (
					<>
						<Button
							label="Cancelar"
							onClick={() => {
								setDadosEditados(dadosOriginais);
								setEditando(false);
							}}
							variant="cancel"
						/>
						<Button
							label="Salvar Alterações"
							onClick={handleSalvar}
							variant="success"
						/>
					</>
				) : (
					<>
						<Button
							label="Alterar Dados"
							onClick={() => setEditando(true)}
							variant="success"
						/>
						<Button
							label="Excluir Conta"
							onClick={() => setShowModalExcluir(true)}
							variant="cancel"
						/>
					</>
				)}

			</div>

			<Modal isOpen={showModalExcluir} onClose={() => setShowModalExcluir(false)}>
				<h3>Confirmar Exclusão</h3>
				<p>Tem certeza que deseja excluir sua conta? Essa ação é irreversível.</p>
				<div className="minha-conta-modal-botoes">
					<Button
						label="Cancelar"
						onClick={() => setShowModalExcluir(false)}
						variant="cancel"
					/>
					<Button
						label="Confirmar Exclusão"
						onClick={handleExcluirConta}
						variant="success"
					/>
				</div>
			</Modal>

			<ModalInfo
				isOpen={showModalInfo}
				onClose={() => {
					fecharModalInfo();
					if (redirectOnClose) {
						window.location.href = "/";
						signOut();
					}
				}}
				title={modalInfoTitle}
				message={modalInfoMessage}
			/>
		</div>
	);
}
