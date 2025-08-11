import useMinhaConta from 'hooks/useMinhaConta';
import Title from 'components/Title';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';

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
	} = useMinhaConta();

	if (loading) return <p>Carregando dados...</p>;
	if (error) return <p>Erro ao carregar dados: {error.message}</p>;
	if (!dadosEditados) return <p>Usuário não encontrado.</p>;

	return (
		<div className="minha-conta-container">
			<Title titulo="Minha Conta" />

			<div className="minha-conta-grid">
				<div className="minha-conta-box left">
					<label>Nome:</label>
					{editando ? (
						<Input name="nome" value={dadosEditados.nome || ""} onChange={handleChange} />
					) : (
						<p>{dadosEditados.nome}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>Email:</label>
					{editando ? (
						<Input name="email" value={dadosEditados.email || ""} onChange={handleChange} />
					) : (
						<p>{dadosEditados.email}</p>
					)}
				</div>

				<div className="minha-conta-box left">
					<label>Usuário:</label>
					{editando ? (
						<Input name="usuario" value={dadosEditados.usuario || ""} onChange={handleChange} />
					) : (
						<p>{dadosEditados.usuario}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>CPF:</label>
					{editando ? (
						<Input name="cpf" maxLength={14} value={dadosEditados.cpf || ""} onChange={handleChange} />
					) : (
						<p>{dadosEditados.cpf}</p>
					)}
				</div>

				{dadosEditados.tipo === 'aluno' && (
					<div className="minha-conta-box left">
						<label>Personal:</label>
						{editando ? (
							<Input
								name="personal.nomeCompleto"
								value={dadosEditados.personal?.nomeCompleto || ""}
								onChange={handleChange}
							/>
						) : (
							<p>{dadosEditados.personal?.nomeCompleto}</p>
						)}
					</div>
				)}

				{dadosEditados.tipo === 'personal' && (
					<>
						<div className="minha-conta-box left">
							<label>CREF:</label>
							{editando ? (
								<Input name="cref" value={dadosEditados.cref || ""} onChange={handleChange} />
							) : (
								<p>{dadosEditados.cref}</p>
							)}
						</div>

						<div className="minha-conta-box right">
							<label>Estado:</label>
							{editando ? (
								<Input name="estado" value={dadosEditados.estado || ""} onChange={handleChange} />
							) : (
								<p>{dadosEditados.estado}</p>
							)}
						</div>

						<div className="minha-conta-box left">
							<label>Cidade:</label>
							{editando ? (
								<Input name="cidade" value={dadosEditados.cidade || ""} onChange={handleChange} />
							) : (
								<p>{dadosEditados.cidade}</p>
							)}
						</div>
					</>
				)}
			</div>

			<div className="minha-conta-botoes">
				{editando ? (
					<Button label="Salvar Alterações" onClick={handleSalvar} />
				) : (
					<Button label="Alterar Dados" onClick={() => setEditando(true)} />
				)}
				<br />
				<Button label="Excluir Conta" onClick={() => setShowModalExcluir(true)} />
			</div>

			<Modal isOpen={showModalExcluir} onClose={() => setShowModalExcluir(false)}>
				<h3>Confirmar Exclusão</h3>
				<p>Tem certeza que deseja excluir sua conta? Essa ação é irreversível.</p>
				<div className="minha-conta-modal-botoes">
					<Button label="Confirmar Exclusão" onClick={handleExcluirConta} />
					<br />
					<Button label="Cancelar" onClick={() => setShowModalExcluir(false)} />
				</div>
			</Modal>
		</div>
	);
}
