// Validação de e-mail
export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

// Formatar CPF com máscara
export const formatCPF = (valor) => {
  if (!valor) return false;

  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return valor;
};

// Validar CPF
export const validateCPF = (cpf) => {
  if (!cpf) return false;

  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf[10]);
};

// Validação simples de número CREF (somente exemplo)
export const validateCREF = (cref) => {
  // Deve ter pelo menos 6 dígitos e não conter letras
  return /^\d{6,}$/.test(cref);
};