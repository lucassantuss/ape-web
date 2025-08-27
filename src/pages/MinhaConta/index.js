import useMinhaConta from 'hooks/useMinhaConta';
import Title from 'components/Title';
import Input from 'components/Input';
import Button from 'components/Button';
import Select from "components/Select";
import Modal from 'components/Modal';
import Loading from "components/Loading";

import './MinhaConta.css';

export default function MinhaConta() {
	const {
		editando,
		setEditando,
		showModalExcluir,
		setShowModalExcluir,
		dadosEditados,
		errors,
		handleChange,
		handleSalvar,
		handleExcluirConta,
		loading,
		error,
		estados,
		cidades,
	} = useMinhaConta();

	if (loading) return <Loading />;
	if (error) return <p>Erro ao carregar dados: {error.message}</p>;
	if (!dadosEditados) return <p>Usuário não encontrado.</p>;

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
							<Input
								name="personal.nomeCompleto"
								value={dadosEditados.personal?.nomeCompleto || ""}
								onChange={handleChange}
								error={errors.personal}
							/>
						) : (
							<p>{dadosEditados.personal?.nomeCompleto}</p>
						)}
					</div>
				)}

				{/* Campos específicos do PERSONAL */}
				{dadosEditados.tipo === "personal" && (
					<>
						<div className="minha-conta-box left">
							<label>N° CREF:</label>
							{editando ? (
								<Input
									name="cref"
									value={dadosEditados.cref || ""}
									onChange={handleChange}
									error={errors.cref}
								/>
							) : (
								<p>{dadosEditados.cref}</p>
							)}
						</div>

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
					</>
				)}
			</div>

			<div className="minha-conta-botoes">
				{editando ? (
					<>
						<Button label="Salvar Alterações" onClick={handleSalvar} />
						<br />
						<Button label="Cancelar" onClick={() => setEditando(false)} cancel />
					</>
				) : (
					<>
						<Button label="Alterar Dados" onClick={() => setEditando(true)} />
						<br />
						<Button label="Excluir Conta" onClick={() => setShowModalExcluir(true)} cancel />
					</>
				)}

			</div>

			<Modal isOpen={showModalExcluir} onClose={() => setShowModalExcluir(false)}>
				<h3>Confirmar Exclusão</h3>
				<p>Tem certeza que deseja excluir sua conta? Essa ação é irreversível.</p>
				<div className="minha-conta-modal-botoes">
					<Button label="Confirmar Exclusão" onClick={handleExcluirConta} />
					<br />
					<Button label="Cancelar" onClick={() => setShowModalExcluir(false)} cancel />
				</div>
			</Modal>
		</div>
	);
}
