import { useState } from 'react';
import { useAuthentication } from 'context/Authentication';
import Title from 'components/Title';
import Input from 'components/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';

import { formatCPF, validateCPF } from 'utils/Validations';

import './MinhaConta.css';

export default function MinhaConta() {
	const { userLogged } = useAuthentication();

	// Simulação de dados mockados
	const usuario = userLogged() || {
		tipo: 'aluno', // ou 'personal'
		nome: 'Lucas Almeida',
		email: 'lucas.almeida@email.com',
		usuario: 'lucasalmeida',
		cpf: '123.456.789-00',
		cref: '123456-G/SP',
		estado: 'SP',
		cidade: 'São Paulo',
		personal: {
			id: '1',
			nomeCompleto: 'Carlos Silva',
		},
	};

	const [editando, setEditando] = useState(false);
	const [showModalExcluir, setShowModalExcluir] = useState(false);
	const [dadosEditados, setDadosEditados] = useState(usuario);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		let newValue = value;

		// Máscara automática para CPF
		if (name === "cpf") {
			newValue = formatCPF(newValue);
		}

		setDadosEditados((prev) => ({ ...prev, [name]: newValue }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const handleSalvar = () => {
		let newErrors = {};

		// Validação de CPF
		if (!validateCPF(dadosEditados.cpf)) {
			newErrors.cpf = "CPF inválido";
		}

		// Se tiver erros, não salva
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		console.log('Dados salvos:', dadosEditados);
		setEditando(false);
	};

	const handleExcluirConta = () => {
		setShowModalExcluir(false);
		console.log('Conta excluída!');
		// Aqui você pode fazer a chamada para a API
	};

	return (
		<div className="minha-conta-container">
			<Title titulo="Minha Conta" />

			<div className="minha-conta-grid">
				<div className="minha-conta-box left">
					<label>Nome:</label>
					{editando ? (
						<Input name="nome" value={dadosEditados.nome} onChange={handleChange} />
					) : (
						<p>{dadosEditados.nome}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>Email:</label>
					{editando ? (
						<Input name="email" value={dadosEditados.email} onChange={handleChange} />
					) : (
						<p>{dadosEditados.email}</p>
					)}
				</div>

				<div className="minha-conta-box left">
					<label>Usuário:</label>
					{editando ? (
						<Input name="usuario" value={dadosEditados.usuario} onChange={handleChange} />
					) : (
						<p>{dadosEditados.usuario}</p>
					)}
				</div>

				<div className="minha-conta-box right">
					<label>CPF:</label>
					{editando ? (
						<Input name="cpf" value={dadosEditados.cpf} onChange={handleChange} />
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
								value={dadosEditados.personal?.nomeCompleto}
								onChange={(e) => {
									setDadosEditados((prev) => ({
										...prev,
										personal: { ...prev.personal, nomeCompleto: e.target.value },
									}));
								}}
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
								<Input name="cref" value={dadosEditados.cref} onChange={handleChange} />
							) : (
								<p>{dadosEditados.cref}</p>
							)}
						</div>

						<div className="minha-conta-box right">
							<label>Estado:</label>
							{editando ? (
								<Input name="estado" value={dadosEditados.estado} onChange={handleChange} />
							) : (
								<p>{dadosEditados.estado}</p>
							)}
						</div>

						<div className="minha-conta-box left">
							<label>Cidade:</label>
							{editando ? (
								<Input name="cidade" value={dadosEditados.cidade} onChange={handleChange} />
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
				<br></br>
				<Button label="Excluir Conta" onClick={() => setShowModalExcluir(true)} />
			</div>

			<Modal isOpen={showModalExcluir} onClose={() => setShowModalExcluir(false)}>
				<h3>Confirmar Exclusão</h3>
				<p>Tem certeza que deseja excluir sua conta? Essa ação é irreversível.</p>
				<div className="minha-conta-modal-botoes">
					<Button label="Confirmar Exclusão" onClick={handleExcluirConta} />
					<br></br>
					<Button label="Cancelar" onClick={() => setShowModalExcluir(false)} />
				</div>
			</Modal>
		</div>
	);
}
