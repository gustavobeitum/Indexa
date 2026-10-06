function normalizarData(valor) {
  if (!valor) return '';
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  const iso = br ? `${br[3]}-${br[2]}-${br[1]}` : valor;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) return null;
  return iso;
}

function validarContato(body = {}) {
  const erros = {};
  const texto = (v) => (typeof v === 'string' ? v.trim() : '');

  const nome = texto(body.nome);
  if (!nome) erros.nome = 'Campo obrigatório';
  else if (nome.length < 4) erros.nome = 'Nome deve ter no mínimo 4 caracteres';
  else if (nome.length > 30) erros.nome = 'Nome deve ter no máximo 30 caracteres';

  const telefone = texto(body.telefone);
  if (!telefone) erros.telefone = 'Telefone obrigatório';

  const email = texto(body.email);
  if (!email) erros.email = 'E-mail obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'Formato de E-mail inválido';

  const aniversario = normalizarData(texto(body.aniversario));
  if (aniversario === null) erros.aniversario = 'Data inválida (use dd/mm/aaaa)';

  if (Object.keys(erros).length) return { erros };

  return {
    erros: null,
    dados: {
      nome,
      telefone,
      email,
      aniversario,
      redes: texto(body.redes),
      observacoes: texto(body.observacoes),
    },
  };
}

module.exports = { validarContato };